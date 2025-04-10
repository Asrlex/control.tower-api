import { GenericRepository } from '@/common/repository/generic-repository.interface';
import { CreateExpenseDto } from '@/api/entities/dtos/home-management/expense.dto';
import {
  ExpenseCategoryI,
  ExpenseI,
} from '@/api/entities/interfaces/home-management.entity';

export const EXPENSE_REPOSITORY = 'EXPENSE_REPOSITORY';

export interface ExpenseRepository
  extends GenericRepository<ExpenseI, string, CreateExpenseDto> {
  findAllCategories(): Promise<ExpenseCategoryI[]>;
}
