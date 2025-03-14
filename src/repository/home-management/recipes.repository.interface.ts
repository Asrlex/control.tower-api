import { GenericRepository } from 'src/repository/generic-repository.interface';
import {
  RecipeDetailI,
  RecipeIngredientI,
  RecipeNameI,
  RecipeStepI,
} from '@/api/entities/interfaces/home-management.entity';
import {
  CreateIngredientDto,
  CreateRecipeDto,
  CreateStepDto,
} from '@/api/entities/dtos/home-management/recipe.dto';

export const RECIPE_REPOSITORY = 'RECIPE_REPOSITORY';

export interface RecipeRepository
  extends GenericRepository<RecipeDetailI, string, CreateRecipeDto> {
  findIngredientByID(ingredientID: string): Promise<RecipeIngredientI>;
  findStepByID(stepID: string): Promise<RecipeStepI>;
  createIngredient(ingredient: CreateIngredientDto): Promise<RecipeIngredientI>;
  createStep(step: CreateStepDto): Promise<RecipeStepI>;
  modifyIngredient(ingredient: CreateIngredientDto): Promise<RecipeIngredientI>;
  modifyStep(step: CreateStepDto): Promise<RecipeStepI>;
  deleteIngredient(ingredientID: string): Promise<void>;
  deleteStep(stepID: string): Promise<void>;
  findAllNames(): Promise<RecipeNameI[]>;
}
