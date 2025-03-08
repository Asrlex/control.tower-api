import {
  Module,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Logger,
} from '@nestjs/common';
import { DatabaseConnection } from 'src/db/database.connection';

@Module({
  providers: [
    {
      provide: 'SQLITE_CONNECTION',
      useFactory: async (logger: Logger) => {
        const maestrosConnection = new DatabaseConnection(
          logger,
          {
            user: process.env.MAESTROS_USER,
            password: process.env.MAESTROS_PASSWORD,
            server: process.env.MAESTROS_SERVER,
            database: process.env.MAESTROS_DATABASE,
            options: {
              trustServerCertificate: true,
              enableArithAbort: true,
              ssl: {
                rejectUnauthorized: false,
              },
            },
            pool: {
              max: 10,
              min: 0,
              idleTimeoutMillis: 30000,
            },
          },
          'sqlite',
        );
        await maestrosConnection.connect();
        return maestrosConnection;
      },
      inject: [Logger],
    },
    {
      provide: 'MAESTROS_CONNECTION',
      useFactory: async (logger: Logger) => {
        const maestrosConnection = new DatabaseConnection(
          logger,
          {
            user: process.env.MAESTROS_USER,
            password: process.env.MAESTROS_PASSWORD,
            server: process.env.MAESTROS_SERVER,
            database: process.env.MAESTROS_DATABASE,
            options: {
              trustServerCertificate: true,
              enableArithAbort: true,
              ssl: {
                rejectUnauthorized: false,
              },
            },
            pool: {
              max: 10,
              min: 0,
              idleTimeoutMillis: 30000,
            },
          },
          'mssql',
        );
        await maestrosConnection.connect();
        return maestrosConnection;
      },
      inject: [Logger],
    },
    Logger,
  ],
  exports: ['INTERDATA_CONNECTION', 'IP6_CONNECTION', 'MAESTROS_CONNECTION'],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('INTERDATA_CONNECTION') private dbConnection: DatabaseConnection,
    @Inject('IP6_CONNECTION') private ip6Connection: DatabaseConnection,
    @Inject('MAESTROS_CONNECTION')
    private maestrosConnection: DatabaseConnection,
  ) {}

  async onModuleInit() {}

  async onModuleDestroy() {
    await this.dbConnection.close();
    await this.ip6Connection.close();
    await this.maestrosConnection.close();
  }
}
