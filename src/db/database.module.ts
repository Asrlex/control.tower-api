import {
  Module,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Logger,
} from '@nestjs/common';
import { DatabaseConnection } from './database.connection';

@Module({
  providers: [
    {
      provide: 'HOME_MANAGEMENT_CONNECTION',
      useFactory: async (logger: Logger) => {
        const sqliteConnection = new DatabaseConnection(
          logger,
          {
            database: process.env.HOME_MANAGER_DATABASE,
          },
          'sqlite',
        );
        await sqliteConnection.connect();
        return sqliteConnection;
      },
      inject: [Logger],
    },
    Logger,
  ],
  exports: ['HOME_MANAGEMENT_CONNECTION'],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('HOME_MANAGEMENT_CONNECTION')
    private sqliteConnection: DatabaseConnection,
  ) {}

  async onModuleInit() {}

  async onModuleDestroy() {
    await this.sqliteConnection.close();
  }
}
