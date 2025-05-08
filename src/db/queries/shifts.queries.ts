import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// SHIFTS
// ******************************************************
const shiftSelectRoot = `
  s.id as shiftID,
  s.date as shiftDate,
  s.timestamp as shiftTimestamp,
  s.type as shiftType
`;
const KeyParam = 'shiftID';
export const shiftQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: shiftSelectRoot,
    SelectTables: `${TableNames.Shifts} s`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: shiftSelectRoot,
    SelectTables: `${TableNames.Shifts} s`,
    SelectId: `s.id`,
  }),
  findByMonth: formatTemplateString(baseQueries.FindById, {
    SelectFields: shiftSelectRoot,
    SelectTables: `${TableNames.Shifts} s`,
    SelectId: `strftime('%Y-%m', s.date)`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Shifts,
    InsertFields: 'date, timestamp, type, user_id',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Shifts,
    UpdateFields: `date = '@date', timestamp = '@timestamp', type = '@type'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Shifts,
  }),
};
