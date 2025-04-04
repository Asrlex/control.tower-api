import { IsNumber, IsString } from 'class-validator';

export class GetExpenseDto {
  @IsNumber()
  expenseID: number;
  @IsString()
  expenseTitle: string;
  @IsString()
  expenseDescription: string;
  @IsNumber()
  expenseAmount: number;
  @IsString()
  expenseDate: string;
  @IsNumber()
  categoryID: number;
  @IsString()
  categoryName: string;
}

export class CreateExpenseDto {
  @IsString()
  expenseTitle: string;
  @IsString()
  expenseDescription: string;
  @IsNumber()
  expenseAmount: number;
  @IsString()
  expenseDate: string;
  @IsNumber()
  categoryID: number;
}
