import { AuthModule } from '@/api/auth/auth.module';
import { DatabaseModule } from '@/db/database.module';
import { EXPENSE_REPOSITORY } from '@/repository/home-management/expenses.repository.interface';
import { Logger, Module } from '@nestjs/common';
import { ExpenseController } from './expenses.controller';
import { ExpenseService } from './expenses.service';
import { ExpenseRepositoryImplementation } from '@/repository/home-management/expenses.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ExpenseController],
  providers: [
    {
      provide: EXPENSE_REPOSITORY,
      useClass: ExpenseRepositoryImplementation,
    },
    ExpenseService,
    Logger,
  ],
})
export class ExpenseModule {}
