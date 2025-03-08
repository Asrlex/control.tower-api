import { Logger } from '@nestjs/common';
import * as oracledb from 'oracledb';
import * as mssql from 'mssql';
import { DatabaseQueryException } from 'src/common/exceptions/dbquery.exception';

/**
 * Clase para gestionar la conexión a una base de datos OracleDB.
 *
 * @class DatabaseConnection
 *
 * @property {oracledb.Connection | sql.ConnectionPool | null} connection - La conexión a la base de datos.
 * @property {NodeJS.Timeout | null} reconnectInterval - Intervalo para reintentar la conexión.
 * @property {boolean} isConnected - Indica si la conexión está establecida.
 * @property {object} config - Configuración de la conexión a la base de datos.
 * @property {string} config.user - Usuario de la base de datos.
 * @property {string} config.password - Contraseña de la base de datos.
 * @property {string} config.connectString - Cadena de conexión a la base de datos.
 *
 * @method connect - Conectar a la base de datos OracleDB.
 * @method private setupPingInterval - Configurar el intervalo de ping para mantener la conexión activa.
 * @method private handleConnectionError - Manejar errores de conexión.
 * @method private scheduleReconnect - Programar un intento de reconexión.
 * @method execute - Ejecutar una consulta SQL.
 * @method close - Cerrar la conexión a la base de datos.
 */
export class DatabaseConnection {
  private dbConnection: oracledb.Connection | mssql.ConnectionPool | null =
    null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  constructor(
    private readonly logger: Logger,
    private readonly config: {
      user: string;
      password: string;
      connectString?: string;
      schema?: string;
      server?: string;
      database?: string;
      options?: {
        trustServerCertificate: boolean;
        enableArithAbort: boolean;
        ssl: { rejectUnauthorized: boolean };
      };
      pool?: { max: number; min: number; idleTimeoutMillis: number };
    },
    private readonly dbType: string,
  ) {}

  /**
   * Conectar a la base de datos OracleDB
   * @returns Conexión a la base de datos
   */
  async connect() {
    try {
      if (this.dbType === 'oracle') {
        this.dbConnection = await oracledb.getConnection(this.config);
      } else if (this.dbType === 'mssql') {
        this.dbConnection = await mssql.connect(this.config);
      }
      this.isConnected = true;
      this.logger.log('Connected to the database');
      this.setupPingInterval();
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Configurar el intervalo de ping para mantener la conexión activa
   * Por defecto se ejecuta cada 5 minutos
   */
  private setupPingInterval() {
    setInterval(
      async () => {
        try {
          if (this.dbConnection) {
            if (this.dbType === 'oracle') {
              await this.dbConnection.ping();
            } else if (this.dbType === 'mssql') {
              const testSQL = 'SELECT 1 AS test';
              await this.dbConnection.query(testSQL);
            }
          }
        } catch (error) {
          this.logger.error('Ping failed, connection might be lost', error);
          this.handleConnectionError();
        }
      },
      5 * 60 * 1000,
    );
  }

  /**
   * Manejar errores de conexión
   */
  private handleConnectionError() {
    this.isConnected = false;
    if (this.dbConnection) {
      this.dbConnection.close().catch(this.logger.error);
      this.dbConnection = null;
    }
    this.scheduleReconnect();
  }

  /**
   * Programar un intento de reconexión
   * Por defecto se intenta cada 10 segundos
   */
  private scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(async () => {
        try {
          await this.connect();
          if (this.isConnected && this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
          }
        } catch (error) {
          this.logger.error('Reconnection attempt failed', error);
        }
      }, 10000);
    }
  }

  /**
   * Ejecutar una consulta SQL
   * @param sql - Consulta SQL
   * @param params - Parámetros de la consulta
   * @returns Resultado de la consulta
   */
  async execute(sql: string, params: any[] = []) {
    if (!this.dbConnection || !this.isConnected) {
      this.logger.error('Database connection is not established');
      this.scheduleReconnect();
    }
    try {
      // this.logger.debug(`Executing query: ${sql}`);
      if (this.dbType === 'oracle') {
        return await this.dbConnection.execute(sql, params);
      } else if (this.dbType === 'mssql') {
        const request: mssql.Request = this.dbConnection.request();
        const result = await request.query(sql);
        return result.recordset;
      }
    } catch (error) {
      this.logger.error('Error executing query', error);
      this.handleConnectionError();
      throw new DatabaseQueryException(this.dbType, sql, error, params);
    }
  }

  /**
   * Ejecutar una consulta SQL de tipo batch
   * @param sql - Consulta SQL
   * @param params - Parámetros de la consulta
   * @returns Resultado de la consulta
   */
  async batchExecute(sql: string[]): Promise<boolean> {
    if (!this.dbConnection || !this.isConnected) {
      throw new Error('Database connection is not established');
    }
    let transaction: oracledb.Transaction | mssql.Transaction | null = null;
    try {
      if (this.dbType === 'oracle') {
        this.logger.debug('Not yet implemented for OracleDB');
        return false;
      } else if (this.dbType === 'mssql') {
        transaction = new mssql.Transaction(this.dbConnection);
        await transaction.begin();
        const request: mssql.Request = transaction.request();
        for (const query of sql) {
          await request.query(query);
        }
        await transaction.commit();
        return true;
      }
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      this.logger.error('Error executing batch query', error);
      this.handleConnectionError();
      throw new DatabaseQueryException(this.dbType, sql, error);
    }
  }

  /**
   * Cerrar la conexión a la base de datos
   */
  async close() {
    if (this.dbConnection) {
      try {
        await this.dbConnection.close();
        this.isConnected = false;
        this.logger.log('Database connection closed');
      } catch (error) {
        this.logger.error('Error closing database connection', error);
      }
    }
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
  }
}
