import { baseQueries, generateQuery } from 'src/db/database.utils';
const productsTable = 'products';
const pantryTable = 'pantry';
const storesTable = 'store';
const shoppingListTable = 'shopping_list';
const productTagsTable = 'product_tag';
const tagsTable = 'tag';
const tasksTable = 'task';
const taskTagsTable = 'task_tag';
const orderTable = 'list_order';
const recipesTable = 'recipe';
const recipeTagsTable = 'recipe_tag';
const recipeIngredientsTable = 'recipe_ingredient';
const recipeStepsTable = 'recipe_step';
// const usersTable = 'user';
// const notesTable = 'note';
// const expensesTable = 'expenses';
// const expenseCategoriesTable = 'expense_category';

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
const productsJoin = `
  LEFT JOIN ${productTagsTable} pt ON pt.product_id = p.id
  LEFT JOIN ${tagsTable} tg ON tg.id = pt.tag_id
`;
export const productsQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'productID' },
    { key: '@SelectFields', value: productsSelectRoot },
    { key: '@SelectTables', value: `${productsTable} p ${productsJoin}` },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: productsSelectRoot },
    { key: '@SelectTables', value: `${productsTable} p ${productsJoin}` },
    { key: '@SelectId', value: `p.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'productID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${productsTable} p ${productsJoin}`,
    },
    {
      key: '@SelectFields',
      value: `${productsSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.productID = ai.productID`,
    },
  ]),
  getOrderProducts: generateQuery(baseQueries.getById, [
    {
      key: '@SelectFields',
      value: `list_order as listOrder`,
    },
    {
      key: '@SelectTables',
      value: `${orderTable} o`,
    },
    {
      key: '@SelectId',
      value: `o.type`,
    },
  ]),
  postOrderProducts: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: orderTable },
    { key: '@InsertFields', value: 'type, list_order' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  deleteOrderProducts: generateQuery(baseQueries.specificHardDelete, [
    { key: '@DeleteTable', value: orderTable },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: productsTable },
    { key: '@InsertFields', value: 'name, unit' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: productsTable },
    { key: '@UpdateFields', value: `name = '@name', unit = '@unit'` },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.hardDelete, [
    { key: '@DeleteTable', value: productsTable },
  ]),
};

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
const stockProductJoin = `
  INNER JOIN products p ON p.id = pa.product_id
  LEFT JOIN ${productTagsTable} pt ON pt.product_id = p.id
  LEFT JOIN ${tagsTable} tg ON tg.id = pt.tag_id
`;
export const stockProductQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'stockProductID' },
    { key: '@SelectFields', value: stockProductSelectRoot },
    { key: '@SelectTables', value: `${pantryTable} pa ${stockProductJoin}` },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: stockProductSelectRoot },
    { key: '@SelectTables', value: `${pantryTable} pa ${stockProductJoin}` },
    { key: '@SelectId', value: `pa.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'stockProductID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${pantryTable} pa ${stockProductJoin}`,
    },
    {
      key: '@SelectFields',
      value: `${stockProductSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.stockProductID = ai.stockProductID`,
    },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: pantryTable },
    { key: '@InsertFields', value: 'amount, product_id' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: pantryTable },
    {
      key: '@UpdateFields',
      value: `amount = '@amount', product_id = '@product_id'`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  modifyAmount: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: pantryTable },
    { key: '@UpdateFields', value: `amount = @amount` },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.hardDelete, [
    { key: '@DeleteTable', value: pantryTable },
  ]),
};

// ******************************************************
// SHOPPING LIST
// ******************************************************
const shoppingListSelectRoot = `
  sl.id as shoppingListProductID,
  sl.amount as shoppingListAmount,
  p.id as productID,
  p.name as productName,
  p.unit as productUnit,
  p.last_bought_at as productDateLastBought,
  p.last_consumed_at as productDateLastConsumed,
  s.id as storeID,
  s.name as storeName,
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
const shoppingListJoin = `
  INNER JOIN products p ON p.id = sl.product_id
  INNER JOIN store s ON s.id = sl.store_id
  LEFT JOIN ${productTagsTable} pt ON pt.product_id = p.id
  LEFT JOIN ${tagsTable} tg ON tg.id = pt.tag_id
`;
export const shoppingListQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'shoppingListProductID' },
    { key: '@SelectFields', value: shoppingListSelectRoot },
    {
      key: '@SelectTables',
      value: `${shoppingListTable} sl ${shoppingListJoin}`,
    },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: shoppingListSelectRoot },
    {
      key: '@SelectTables',
      value: `${shoppingListTable} sl ${shoppingListJoin}`,
    },
    { key: '@SelectId', value: `sl.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'shoppingListProductID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${shoppingListTable} sl ${shoppingListJoin}`,
    },
    {
      key: '@SelectFields',
      value: `${shoppingListSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.shoppingListProductID = ai.shoppingListProductID`,
    },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: shoppingListTable },
    { key: '@InsertFields', value: 'amount, product_id, store_id' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: shoppingListTable },
    {
      key: '@UpdateFields',
      value: `amount = '@amount', product_id = '@product_id', store_id = '@store_id'`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  modifyAmount: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: shoppingListTable },
    { key: '@UpdateFields', value: `amount = @amount` },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.hardDelete, [
    { key: '@DeleteTable', value: shoppingListTable },
  ]),
};

// ******************************************************
// STORES
// ******************************************************
const storesSelectRoot = `
  s.id as storeID,
  s.name as storeName
`;
export const storesQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'storeID' },
    { key: '@SelectFields', value: storesSelectRoot },
    { key: '@SelectTables', value: `${storesTable} s` },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: storesSelectRoot },
    { key: '@SelectTables', value: `${storesTable} s` },
    { key: '@SelectId', value: `s.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'storeID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${storesTable} s`,
    },
    {
      key: '@SelectFields',
      value: `${storesSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.storeID = ai.storeID`,
    },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: storesTable },
    { key: '@InsertFields', value: 'name' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: storesTable },
    { key: '@UpdateFields', value: `name = '@name'` },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.delete, [
    { key: '@DeleteTable', value: storesTable },
  ]),
};

// ******************************************************
// TAGS
// ******************************************************
const tagsSelectRoot = `
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
export const tagsQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'tagID' },
    { key: '@SelectFields', value: tagsSelectRoot },
    { key: '@SelectTables', value: `${tagsTable} tg` },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: tagsSelectRoot },
    { key: '@SelectTables', value: `${tagsTable} tg` },
    { key: '@SelectId', value: `tg.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'tagID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${tagsTable} tg`,
    },
    {
      key: '@SelectFields',
      value: `${tagsSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.tagID = ai.tagID`,
    },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: tagsTable },
    { key: '@InsertFields', value: 'name, type' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  createProductTag: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: productTagsTable },
    { key: '@InsertFields', value: 'product_id, tag_id' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  createTaskTag: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: taskTagsTable },
    { key: '@InsertFields', value: 'task_id, tag_id' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  createRecipeTag: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: recipeTagsTable },
    { key: '@InsertFields', value: 'recipe_id, tag_id' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: tagsTable },
    { key: '@UpdateFields', value: `name = '@name', type = '@type'` },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.hardDelete, [
    { key: '@DeleteTable', value: tagsTable },
  ]),
  deleteProductTag: generateQuery(baseQueries.specificHardDelete, [
    { key: '@DeleteTable', value: productTagsTable },
  ]),
  deleteTaskTag: generateQuery(baseQueries.specificHardDelete, [
    { key: '@DeleteTable', value: taskTagsTable },
  ]),
};

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
  LEFT JOIN ${taskTagsTable} tt ON tt.task_id = t.id
  LEFT JOIN ${tagsTable} tg ON tg.id = tt.id
`;
export const tasksQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'taskID' },
    { key: '@SelectFields', value: tasksSelectRoot },
    { key: '@SelectTables', value: `${tasksTable} t ${tasksJoin}` },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: tasksSelectRoot },
    { key: '@SelectTables', value: `${tasksTable} t ${tasksJoin}` },
    { key: '@SelectId', value: `t.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'taskID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${tasksTable} t ${tasksJoin}`,
    },
    {
      key: '@SelectFields',
      value: `${tasksSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.taskID = ai.taskID`,
    },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: tasksTable },
    { key: '@InsertFields', value: 'title, description' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: tasksTable },
    {
      key: '@UpdateFields',
      value: `title = '@title', description = '@description'`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  toggleCompletedTask: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: tasksTable },
    {
      key: '@UpdateFields',
      value: `completed = @completed, completed_at = @completedAt`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.delete, [
    { key: '@DeleteTable', value: tasksTable },
  ]),
};

// ******************************************************
// RECIPES
// ******************************************************
const recipeSelectRoot = `
  r.id as recipeID,
  r.name as recipeName,
  r.description as recipeDescription,
  ri.id as ingredientID,
  ri.amount as ingredientAmount,
  ri.unit as ingredientUnit,
  p.id as productID,
  p.name as productName,
  rs.id as stepID,
  rs.name as stepName,
  rs.description as stepDescription,
  rs.step_order as stepOrder,
  tg.id as tagID,
  tg.name as tagName,
  tg.type as tagType
`;
const ingredientSelectRoot = `
  ri.id as ingredientID,
  ri.amount as ingredientAmount,
  ri.unit as ingredientUnit,
  p.id as productID,
  p.name as productName
`;
const stepSelectRoot = `
  rs.id as stepID,
  rs.name as stepName,
  rs.description as stepDescription,
  rs.step_order as stepOrder
`;
const recipeJoin = `
  INNER JOIN ${recipeIngredientsTable} ri ON ri.recipe_id = r.id
  INNER JOIN ${productsTable} p ON p.id = ri.product_id
  INNER JOIN ${recipeStepsTable} rs ON rs.recipe_id = r.id
  LEFT JOIN ${recipeTagsTable} tt ON tt.recipe_id = r.id
  LEFT JOIN ${tagsTable} tg ON tg.id = tt.tag_id
`;
const ingredientJoin = `
  INNER JOIN ${productsTable} p ON p.id = ri.product_id
`;
export const recipesQueries = {
  getAll: generateQuery(baseQueries.getAll, [
    { key: '@KeyParam', value: 'recipeID' },
    { key: '@SelectFields', value: recipeSelectRoot },
    { key: '@SelectTables', value: `${recipesTable} r ${recipeJoin}` },
  ]),
  getOne: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: recipeSelectRoot },
    { key: '@SelectTables', value: `${recipesTable} r ${recipeJoin}` },
    { key: '@SelectId', value: `r.id` },
  ]),
  getOneIngredient: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: ingredientSelectRoot },
    {
      key: '@SelectTables',
      value: `${recipeIngredientsTable} ri ${ingredientJoin}`,
    },
    { key: '@SelectId', value: `ri.id` },
  ]),
  getOneStep: generateQuery(baseQueries.getById, [
    { key: '@SelectFields', value: stepSelectRoot },
    { key: '@SelectTables', value: `${recipeStepsTable} rs` },
    { key: '@SelectId', value: `rs.id` },
  ]),
  get: generateQuery(baseQueries.search, [
    {
      key: '@KeyParam',
      value: 'recipeID',
    },
    {
      key: '@IncludedItemsTable',
      value: `${recipesTable} r ${recipeJoin}`,
    },
    {
      key: '@SelectFields',
      value: `${recipeSelectRoot}`,
    },
    {
      key: '@FilterJoins',
      value: `fr.recipeID = ai.recipeID`,
    },
  ]),
  create: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: recipesTable },
    { key: '@InsertFields', value: 'name, description' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  createIngredient: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: recipeIngredientsTable },
    { key: '@InsertFields', value: 'recipe_id, product_id, amount, unit' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  createStep: generateQuery(baseQueries.insertsqlite, [
    { key: '@InsertTable', value: recipeStepsTable },
    { key: '@InsertFields', value: 'recipe_id, name, description, step_order' },
    { key: '@InsertOutput', value: 'RETURNING id' },
  ]),
  update: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: recipesTable },
    {
      key: '@UpdateFields',
      value: `name = '@name', description = '@description'`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  updateIngredient: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: recipeIngredientsTable },
    {
      key: '@UpdateFields',
      value: `amount = '@amount', unit = '@unit'`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  updateStep: generateQuery(baseQueries.update, [
    { key: '@UpdateTable', value: recipeStepsTable },
    {
      key: '@UpdateFields',
      value: `name = '@name', description = '@description', step_order = '@order'`,
    },
    { key: '@UpdateId', value: 'id' },
  ]),
  delete: generateQuery(baseQueries.delete, [
    { key: '@DeleteTable', value: recipesTable },
  ]),
  deleteIngredient: generateQuery(baseQueries.specificHardDelete, [
    { key: '@DeleteTable', value: recipeIngredientsTable },
  ]),
  deleteStep: generateQuery(baseQueries.specificHardDelete, [
    { key: '@DeleteTable', value: recipeStepsTable },
  ]),
};
