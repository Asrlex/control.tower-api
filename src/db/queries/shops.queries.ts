import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// SHOPS
// ******************************************************
const storesSelectRoot = `
  s.id as storeID,
  s.name as storeName
`;
const KeyParam = 'storeID';
export const storesQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: storesSelectRoot,
    SelectTables: `${TableNames.Stores} s`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: storesSelectRoot,
    SelectTables: `${TableNames.Stores} s`,
    SelectId: `s.id`,
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Stores} s`,
    SelectFields: `${storesSelectRoot}`,
    FilterJoins: `fr.storeID = ai.storeID`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Stores,
    InsertFields: 'name',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Stores,
    UpdateFields: `name = '@name'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Stores,
  }),
};
