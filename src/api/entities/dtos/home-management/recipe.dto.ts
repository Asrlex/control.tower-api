import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetRecipeDto {
  @IsNumber()
  recipeID: number;
  @IsString()
  recipeName: string;
  @IsString()
  recipeDescription: string;
  @IsNumber()
  ingredientID: number;
  @IsNumber()
  ingredientAmount: number;
  @IsString()
  ingredientUnit: string;
  @IsBoolean()
  ingredientIsOptional: boolean;
  @IsNumber()
  productID: number;
  @IsString()
  productName: string;
  @IsNumber()
  stepID: number;
  @IsString()
  stepName: string;
  @IsString()
  stepDescription: string;
  @IsNumber()
  stepOrder: number;
  @IsBoolean()
  stepIsOptional: boolean;
  @IsNumber()
  tagID: number;
  @IsString()
  tagName: string;
  @IsString()
  tagType: string;
}

export class CreateRecipeDto {
  @IsNumber()
  @IsOptional()
  recipeID: number;
  @IsString()
  recipeName: string;
  @IsString()
  recipeDescription: string;

  @IsOptional()
  @IsArray()
  steps: CreateStepDto[];
  @IsOptional()
  @IsArray()
  ingredients: CreateIngredientDto[];
}

export class CreateIngredientDto {
  @IsNumber()
  @IsOptional()
  recipeIngredientID: number;
  @IsNumber()
  recipeID: number;
  @IsNumber()
  productID: number;
  @IsNumber()
  recipeIngredientAmount: number;
  @IsString()
  recipeIngredientUnit: string;
  @IsBoolean()
  recipeIngredientIsOptional: boolean;
}

export class CreateStepDto {
  @IsNumber()
  @IsOptional()
  recipeStepID: number;
  @IsNumber()
  recipeID: number;
  @IsString()
  recipeStepName: string;
  @IsString()
  recipeStepDescription: string;
  @IsNumber()
  recipeStepOrder: number;
  @IsBoolean()
  recipeStepIsOptional: boolean;
}
