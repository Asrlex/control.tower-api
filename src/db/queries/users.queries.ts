import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// USERS
// ******************************************************
const usersSelectRoot = `
  u.id as userID,
  u.username as userName,
  u.email as userEmail,
  u.password as userPassword,
  u.created_at as userCreatedAt,
  u.last_modified_at as userUpdatedAt
`;
const KeyParam = 'userID';
export const usersQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: usersSelectRoot,
    SelectTables: `${TableNames.Users} u`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: usersSelectRoot,
    SelectTables: `${TableNames.Users} u`,
    SelectId: `u.id`,
  }),
  findByEmail: formatTemplateString(baseQueries.FindById, {
    SelectFields: usersSelectRoot,
    SelectTables: `${TableNames.Users} u`,
    SelectId: `u.email`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Users,
    InsertFields: 'email, password',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Users,
    UpdateFields: `email = '@email', password = '@password'`,
    UpdateId: 'id',
  }),
  saveBiometricCredential: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Users,
    InsertFields: 'user_id, credential_id, credential_public_key',
    InsertOutput: 'RETURNING id',
  }),
  saveChallenge: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Challenges,
    InsertFields: 'user_id, challenge',
    InsertOutput: 'RETURNING id',
  }),
  findChallenge: formatTemplateString(baseQueries.FindById, {
    SelectFields: 'challenge',
    SelectTables: TableNames.Challenges,
    SelectId: 'user_id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Users,
  }),
};
