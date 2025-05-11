import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

// ******************************************************
// TASKS
// ******************************************************
const tasksSelectRoot = `
  t.id as taskID,
  t.title as taskTitle,
  t.description as taskDescription,
  t.completed as taskCompleted,
  t.completed_at as taskCompletedAt,
  t.created_at as taskCreatedAt,
  t.last_modified_at as taskUpdatedAt,
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
const tasksJoin = `
  LEFT JOIN ${TableNames.TaskTags} tt ON tt.task_id = t.id
  LEFT JOIN ${TableNames.Tags} tg ON tg.id = tt.id
`;
const KeyParam = 'taskID';
export const tasksQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: tasksSelectRoot,
    SelectTables: `${TableNames.Tasks} t ${tasksJoin}`,
  }),
  findAllHouseTasks: `
    WITH UniqueValues AS (
      SELECT DISTINCT houseTaskID
      FROM ${TableNames.HouseTasks}
    )
    SELECT
      ai.*,
      (SELECT COUNT(*) FROM UniqueValues) AS total
    FROM (
      select
        id as houseTaskID, name as houseTaskName, date as houseTaskDate
      from ${TableNames.HouseTasks}
      order by date desc
    ) ai
  `,
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: tasksSelectRoot,
    SelectTables: `${TableNames.Tasks} t ${tasksJoin}`,
    SelectId: `t.id`,
  }),
  findHouseTaskByID: formatTemplateString(baseQueries.FindById, {
    SelectFields:
      'id as houseTaskID, name as houseTaskName, date as houseTaskDate',
    SelectTables: TableNames.HouseTasks,
    SelectId: 'id',
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Tasks} t ${tasksJoin}`,
    SelectFields: `${tasksSelectRoot}`,
    FilterJoins: `fr.taskID = ai.taskID`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Tasks,
    InsertFields: 'title, description',
    InsertOutput: 'RETURNING id',
  }),
  createHouseTask: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.HouseTasks,
    InsertFields: 'name',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Tasks,
    UpdateFields: `title = '@title', description = '@description'`,
    UpdateId: 'id',
  }),
  toggleCompletedTask: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Tasks,
    UpdateFields: `completed = '@completed', completed_at = '@completedAt'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Tasks,
  }),
  deleteHouseTask: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.HouseTasks,
  }),
};
