import { CreateExpenseDto } from '@/api/entities/dtos/home-management/expense.dto';
import {
  ExpenseCategoryI,
  ExpenseI,
} from '@/api/entities/interfaces/home-management.entity';
import { GenericRepository } from 'src/repository/generic-repository.interface';

export const EXPENSE_REPOSITORY = 'EXPENSE_REPOSITORY';

export interface ExpenseRepository
  extends GenericRepository<ExpenseI, string, CreateExpenseDto> {
  findAllCategories(): Promise<ExpenseCategoryI[]>;
}
