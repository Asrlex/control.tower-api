import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// EXPENSES
// ******************************************************
const expensesSelectRoot = `
  e.id as expenseID,
  e.amount as expenseAmount,
  e.description as expenseDescription,
  e.date as expenseDate,
  ec.id as categoryID,
  ec.name as categoryName
`;
const KeyParam = 'expenseID';
const expensesJoin = `
  LEFT JOIN ${TableNames.ExpenseCategories} ec ON ec.id = e.category_id
`;
export const expensesQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: expensesSelectRoot,
    SelectTables: `${TableNames.Expenses} e ${expensesJoin}`,
  }),
  findAllCategories: formatTemplateString(baseQueries.FindAll, {
    KeyParam: 'categoryID',
    SelectFields: 'ec.id as categoryID, ec.name as categoryName',
    SelectTables: `${TableNames.ExpenseCategories} ec`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: expensesSelectRoot,
    SelectTables: `${TableNames.Expenses} e ${expensesJoin}`,
    SelectId: `e.id`,
  }),
  findByMonth: formatTemplateString(baseQueries.FindById, {
    SelectFields: expensesSelectRoot,
    SelectTables: `${TableNames.Expenses} e ${expensesJoin}`,
    SelectId: `strftime('%Y-%m', e.date)`,
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Expenses} e ${expensesJoin}`,
    SelectFields: `${expensesSelectRoot}`,
    FilterJoins: `fr.expenseID = ai.expenseID`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Expenses,
    InsertFields: 'amount, description, date, category_id',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Expenses,
    UpdateFields: `amount = '@amount', description = '@description', date = '@date', category_id = '@category_id'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Expenses,
  }),
  deleteCategory: formatTemplateString(baseQueries.SpecificHardDelete, {
    DeleteTable: TableNames.ExpenseCategories,
    DeleteFields: `category_id = @category_id`,
    DeleteId: `id = @id`,
  }),
};
