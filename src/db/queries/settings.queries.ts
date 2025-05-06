import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// SETTINGS
// ******************************************************
const settingsSelectRoot = `
  s.id as settingsID,
  s.settings as settings,
  s.user_id as settingsUserID,
  s.created_at as settingsCreatedAt,
  s.last_modified_at as settingsUpdatedAt
`;
const KeyParam = 'settingsID';
export const settingsQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: settingsSelectRoot,
    SelectTables: `${TableNames.Settings} s`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: settingsSelectRoot,
    SelectTables: `${TableNames.Settings} s`,
    SelectId: `s.id`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Settings,
    InsertFields: 'settings, user_id',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Settings,
    UpdateFields: `settings = '@settings'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.SpecificHardDelete, {
    DeleteTable: TableNames.Settings,
    DeleteFields: `user_id = '@user_id'`,
  }),
};
