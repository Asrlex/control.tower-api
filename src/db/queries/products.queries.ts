import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// PRODUCTS
// ******************************************************
const productsSelectRoot = `
  p.id as productID,
  p.name as productName,
  p.unit as productUnit,
  p.last_bought_at as productDateLastBought,
  p.last_consumed_at as productDateLastConsumed,
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
const KeyParam = 'productID';
const productsJoin = `
  LEFT JOIN ${TableNames.ProductTags} pt ON pt.product_id = p.id
  LEFT JOIN ${TableNames.Tags} tg ON tg.id = pt.tag_id
`;
export const productsQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: productsSelectRoot,
    SelectTables: `${TableNames.Products} p ${productsJoin}`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: productsSelectRoot,
    SelectTables: `${TableNames.Products} p ${productsJoin}`,
    SelectId: `p.id`,
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Products} p ${productsJoin}`,
    SelectFields: `${productsSelectRoot}`,
    FilterJoins: `fr.productID = ai.productID`,
  }),
  getOrderProducts: formatTemplateString(baseQueries.FindById, {
    SelectFields: `p.id as productID, p.name as productName, p.unit as productUnit`,
    SelectTables: `${TableNames.Products} p`,
    SelectId: `p.id`,
  }),
  postOrderProducts: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Order,
    InsertFields: 'product_id, list_order',
    InsertOutput: 'RETURNING id',
  }),
  deleteOrderProducts: formatTemplateString(baseQueries.SpecificHardDelete, {
    DeleteTable: TableNames.Order,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Products,
    InsertFields: 'name, unit',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Products,
    UpdateFields: `name = '@name', unit = '@unit'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Products,
  }),
};
