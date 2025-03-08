export class DatabaseQueryException extends Error {
  dbType: string;
  sql: string | string[];
  params: any[];
  originalError: any;

  constructor(
    dbType: string,
    sql: string | string[],
    originalError: any,
    params?: any[],
  ) {
    super(`Error executing query on ${dbType} database`);
    this.name = 'DatabaseQueryException';
    this.dbType = dbType;
    this.sql = sql;
    this.params = params;
    this.originalError = originalError;

    Object.setPrototypeOf(this, DatabaseQueryException.prototype);
  }

  toString() {
    const isDev = process.env.NODE_ENV === 'development';
    const sqlString = Array.isArray(this.sql) ? this.sql[0] : this.sql;
    return `
      DatabaseQueryException: ${this.message}
      DB Type: ${this.dbType}
      ${isDev ? `SQL: ${sqlString}` : ''}
      ${isDev ? `Params: ${JSON.stringify(this.params)}` : ''}
      Original Error: ${this.originalError}
    `;
  }

  toObject() {
    const isDev = process.env.NODE_ENV === 'development';
    return {
      name: this.name,
      message: this.message,
      dbType: this.dbType,
      sql: isDev ? this.sql : undefined,
      params: isDev ? this.params : undefined,
      originalError: this.originalError,
    };
  }
}
