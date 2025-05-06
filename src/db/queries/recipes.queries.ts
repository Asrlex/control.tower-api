import { formatTemplateString } from '@/common/utils/string-formatter';
import { baseQueries } from '../base-queries';
import { TableNames } from '../enums/db.enum';

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
  ri.optional as ingredientOptional,
  p.id as productID,
  p.name as productName,
  rs.id as stepID,
  rs.name as stepName,
  rs.description as stepDescription,
  rs.step_order as stepOrder,
  rs.optional as stepOptional,
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
  INNER JOIN ${TableNames.RecipeIngredients} ri ON ri.recipe_id = r.id
  INNER JOIN ${TableNames.Products} p ON p.id = ri.product_id
  INNER JOIN ${TableNames.RecipeSteps} rs ON rs.recipe_id = r.id
  LEFT JOIN ${TableNames.RecipeTags} tt ON tt.recipe_id = r.id
  LEFT JOIN ${TableNames.Tags} tg ON tg.id = tt.tag_id
`;
const ingredientJoin = `
  INNER JOIN ${TableNames.Products} p ON p.id = ri.product_id
`;
const KeyParam = 'recipeID';
export const recipesQueries = {
  findAll: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: recipeSelectRoot,
    SelectTables: `${TableNames.Recipes} r ${recipeJoin}`,
  }),
  findAllNames: formatTemplateString(baseQueries.FindAll, {
    KeyParam,
    SelectFields: `r.id as recipeID, r.name as recipeName, tg.id as tagID, tg.name as tagName, tg.type as tagType`,
    SelectTables: `${TableNames.Recipes} r LEFT JOIN ${TableNames.RecipeTags} tt ON tt.recipe_id = r.id LEFT JOIN ${TableNames.Tags} tg ON tg.id = tt.tag_id`,
  }),
  findByID: formatTemplateString(baseQueries.FindById, {
    SelectFields: recipeSelectRoot,
    SelectTables: `${TableNames.Recipes} r ${recipeJoin}`,
    SelectId: `r.id`,
  }),
  findByIDIngredient: formatTemplateString(baseQueries.FindById, {
    SelectFields: ingredientSelectRoot,
    SelectTables: `${TableNames.RecipeIngredients} ri ${ingredientJoin}`,
    SelectId: `ri.id`,
  }),
  findByIDStep: formatTemplateString(baseQueries.FindById, {
    SelectFields: stepSelectRoot,
    SelectTables: `${TableNames.RecipeSteps} rs`,
    SelectId: `rs.id`,
  }),
  find: formatTemplateString(baseQueries.Find, {
    KeyParam,
    IncludedItemsTable: `${TableNames.Recipes} r ${recipeJoin}`,
    SelectFields: `${recipeSelectRoot}`,
    FilterJoins: `fr.recipeID = ai.recipeID`,
  }),
  create: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.Recipes,
    InsertFields: 'name, description',
    InsertOutput: 'RETURNING id',
  }),
  createIngredient: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.RecipeIngredients,
    InsertFields: 'recipe_id, product_id, amount, unit',
    InsertOutput: 'RETURNING id',
  }),
  createStep: formatTemplateString(baseQueries.Create, {
    InsertTable: TableNames.RecipeSteps,
    InsertFields: 'recipe_id, name, description, step_order',
    InsertOutput: 'RETURNING id',
  }),
  update: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.Recipes,
    UpdateFields: `name = '@name', description = '@description'`,
    UpdateId: 'id',
  }),
  updateIngredient: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.RecipeIngredients,
    UpdateFields: `amount = '@amount', unit = '@unit'`,
    UpdateId: 'id',
  }),
  updateStep: formatTemplateString(baseQueries.Update, {
    UpdateTable: TableNames.RecipeSteps,
    UpdateFields: `name = '@name', description = '@description', step_order = '@step_order'`,
    UpdateId: 'id',
  }),
  delete: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.Recipes,
  }),
  deleteIngredient: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.RecipeIngredients,
  }),
  deleteStep: formatTemplateString(baseQueries.HardDelete, {
    DeleteTable: TableNames.RecipeSteps,
  }),
};
