import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { dtoValidator, formatResponse } from 'src/api/utils/utils.api';
import { ValidatePaginationPipe } from 'src/common/pipes/pagination.pipe';
import { SearchCriteriaI } from 'src/api/entities/interfaces/api.entity';
import { ValidateSearchCriteriaPipe } from 'src/common/pipes/search.pipe';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GlobalApiKeyGuard } from '@/api/auth/guards/global-api-key.guard';
import {
  CreateIngredientDto,
  CreateRecipeDto,
  CreateStepDto,
} from '@/api/entities/dtos/home-management/recipe.dto';
import { RecipeService } from './recipes.service';
import { JwtAuthGuard } from '@/api/auth/guards/jwt-auth.guard';

@ApiTags('Recipes')
@Controller()
@UseGuards(GlobalApiKeyGuard)
@UseGuards(JwtAuthGuard)
export class RecipeController {
  constructor(
    private readonly logger: Logger,
    private readonly recipeService: RecipeService,
  ) {}

  @Get('status')
  status() {
    return this.recipeService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({
    status: 200,
    description: 'Recipe(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllRecipes() {
    this.logger.debug('GET /recipes/all');
    const response = await this.recipeService.getAllRecipes();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('names')
  @ApiOperation({ summary: 'Get all recipe names' })
  @ApiResponse({
    status: 200,
    description: 'Names retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllRecipeNames() {
    this.logger.debug('GET /recipes/names');
    const response = await this.recipeService.getAllRecipeNames();
    const formattedResponse = formatResponse(response);
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get a recipe by ID',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getRecipeById(@Param('id') id: string) {
    this.logger.debug('GET /recipes/id/:id');
    const response = await this.recipeService.getRecipeById(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Get('/ingredient/id/:id')
  @ApiOperation({
    summary: 'Get a recipe ingredient by ID',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe ingredient(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getIngredientByID(@Param('id') id: string) {
    this.logger.debug('GET /recipes/ingredient/id/:id');
    const response = await this.recipeService.getIngredientByID(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Get('/step/id/:id')
  @ApiOperation({
    summary: 'Get a recipe step by ID',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe step(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getStepByID(@Param('id') id: string) {
    this.logger.debug('GET /recipes/step/id/:id');
    const response = await this.recipeService.getStepByID(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Get('')
  @ApiOperation({
    summary: 'Get recipes with pagination and optional search criteria',
  })
  @ApiQuery({ name: 'page', description: 'Requested page', type: 'number' })
  @ApiQuery({ name: 'limit', description: 'Elements per page', type: 'number' })
  @ApiQuery({
    name: 'searchCriteria',
    description: 'Search criteria',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Recipe(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getRecipes(
    @Query('page', new ValidatePaginationPipe()) page: number = 0,
    @Query('limit', new ValidatePaginationPipe()) limit: number = 50,
    @Query('searchCriteria', new ValidateSearchCriteriaPipe())
    searchCriteria?: string,
  ) {
    this.logger.debug('GET /recipes');
    const searchCriteriaObj: SearchCriteriaI = JSON.parse(
      decodeURIComponent(searchCriteria),
    );
    const response = await this.recipeService.getRecipes(
      page,
      limit,
      searchCriteriaObj,
    );
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
      page,
      limit,
      searchCriteria: searchCriteriaObj,
    });
    return formattedResponse;
  }

  @Post('')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create a new recipe',
  })
  @ApiBody({ description: 'Recipe data', type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createRecipe(@Body() recipe: CreateRecipeDto) {
    this.logger.debug('POST /recipes');
    const response = await this.recipeService.createRecipe(recipe);
    const formattedResponse = formatResponse(response, {
      id: response.recipeID,
    });
    return formattedResponse;
  }

  @Post('ingredient')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create a new ingredient',
  })
  @ApiBody({ description: 'Recipe data', type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createIngredient(@Body() ingredient: CreateIngredientDto) {
    this.logger.debug('POST /recipes/ingredient');
    const response = await this.recipeService.createIngredient(ingredient);
    const formattedResponse = formatResponse(response, {
      id: response.recipeIngredientID,
    });
    return formattedResponse;
  }

  @Post('step')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create a new step',
  })
  @ApiBody({ description: 'Recipe data', type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createStep(@Body() step: CreateStepDto) {
    this.logger.debug('POST /recipes/step');
    const response = await this.recipeService.createStep(step);
    const formattedResponse = formatResponse(response, {
      id: response.recipeStepID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing recipe',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiBody({ description: 'Recipe data', type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateRecipe(@Param('id') id: string, @Body() recipe: CreateRecipeDto) {
    this.logger.debug('PUT /recipes/:id');
    const response = await this.recipeService.updateRecipe(id, recipe);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Put('ingredient/:id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing ingredient',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiBody({ description: 'Recipe data', type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateIngredient(
    @Param('id') id: string,
    @Body() ingredient: CreateIngredientDto,
  ) {
    this.logger.debug('PUT /recipes/ingredient/:id');
    const response = await this.recipeService.modifyIngredient(ingredient);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Put('step/:id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing step',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiBody({ description: 'Recipe data', type: CreateRecipeDto })
  @ApiResponse({
    status: 200,
    description: 'Recipe updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateStep(@Param('id') id: string, @Body() step: CreateStepDto) {
    this.logger.debug('PUT /recipes/step/:id');
    const response = await this.recipeService.modifyStep(step);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing recipe',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteRecipe(@Param('id') id: string) {
    this.logger.debug('DELETE /recipes/:id');
    await this.recipeService.deleteRecipe(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }

  @Delete('ingredient/:id')
  @ApiOperation({
    summary: 'Delete an existing ingredient',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteIngredient(@Param('id') id: string) {
    this.logger.debug('DELETE /recipes/ingredient/:id');
    await this.recipeService.deleteIngredient(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }

  @Delete('step/:id')
  @ApiOperation({
    summary: 'Delete an existing step',
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({
    status: 200,
    description: 'Recipe deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteStep(@Param('id') id: string) {
    this.logger.debug('DELETE /recipes/step/:id');
    await this.recipeService.deleteStep(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
