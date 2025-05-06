import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// STOCK
// ******************************************************
const stockProductSelectRoot = `
  pa.id as stockProductID,
  pa.amount as stockProductAmount,
  p.id as productID,
  p.name as productName,
  p.unit as productUnit,
  p.last_bought_at as productDateLastBought,
  p.last_consumed_at as productDateLastConsumed,
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
const KeyParam = 'stockProductID';
const stockProductJoin = `
  INNER JOIN products p ON p.id = pa.product_id
  LEFT JOIN ${TableNames.ProductTags} pt ON pt.product_id = p.id
  LEFT JOIN ${TableNames.Tags} tg ON tg.id = pt.tag_id
`;
export const stockProductQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: stockProductSelectRoot,
    SelectTables: `${TableNames.Pantry} pa ${stockProductJoin}`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: stockProductSelectRoot,
    SelectTables: `${TableNames.Pantry} pa ${stockProductJoin}`,
    SelectId: `pa.id`,
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Pantry} pa ${stockProductJoin}`,
    SelectFields: `${stockProductSelectRoot}`,
    FilterJoins: `fr.stockProductID = ai.stockProductID`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Pantry,
    InsertFields: 'amount, product_id',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Pantry,
    UpdateFields: `amount = '@amount', product_id = '@product_id'`,
    UpdateId: 'id',
  }),
  modifyAmount: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Pantry,
    UpdateFields: `amount = '@amount'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Pantry,
  }),
};
