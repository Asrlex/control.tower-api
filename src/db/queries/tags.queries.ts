import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// TAGS
// ******************************************************
const tagsSelectRoot = `
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
const KeyParam = 'tagID';
export const tagsQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: tagsSelectRoot,
    SelectTables: `${TableNames.Tags} tg`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: tagsSelectRoot,
    SelectTables: `${TableNames.Tags} tg`,
    SelectId: `tg.id`,
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Tags} tg`,
    SelectFields: `${tagsSelectRoot}`,
    FilterJoins: `fr.tagID = ai.tagID`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Tags,
    InsertFields: 'name, type',
    InsertOutput: 'RETURNING id',
  }),
  createProductTag: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.ProductTags,
    InsertFields: 'product_id, tag_id',
    InsertOutput: 'RETURNING id',
  }),
  createTaskTag: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.TaskTags,
    InsertFields: 'task_id, tag_id',
    InsertOutput: 'RETURNING id',
  }),
  createRecipeTag: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.RecipeTags,
    InsertFields: 'recipe_id, tag_id',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Tags,
    UpdateFields: `name = '@name', type = '@type'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Tags,
  }),
  deleteProductTag: formatTemplateString(baseQueries.SpecificHardDelete, {
    DeleteTable: TableNames.ProductTags,
  }),
  deleteTaskTag: formatTemplateString(baseQueries.SpecificHardDelete, {
    DeleteTable: TableNames.TaskTags,
  }),
  deleteRecipeTag: formatTemplateString(baseQueries.SpecificHardDelete, {
    DeleteTable: TableNames.RecipeTags,
  }),
};
