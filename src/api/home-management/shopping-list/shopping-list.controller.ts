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
import { ShoppingListProductService } from './shopping-list.service';
import { CreateShoppingListProductDto } from '@/api/entities/dtos/home-management/shopping-list.dto';
import { JwtAuthGuard } from '@/api/auth/guards/jwt-auth.guard';

@ApiTags('Shopping List Products')
@Controller()
@UseGuards(GlobalApiKeyGuard)
@UseGuards(JwtAuthGuard)
export class ShoppingListProductController {
  constructor(
    private readonly logger: Logger,
    private readonly shoppingListProductService: ShoppingListProductService,
  ) {}

  @Get('status')
  status() {
    return this.shoppingListProductService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Product(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllProducts() {
    this.logger.debug('GET /shopping-list-products/all');
    const response = await this.shoppingListProductService.getAllProducts();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get a products by ID',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getProductById(@Param('id') id: string) {
    this.logger.debug('GET /shopping-list-products/id/:id');
    const response = await this.shoppingListProductService.getProductById(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Get('')
  @ApiOperation({
    summary: 'Get products with pagination and optional search criteria',
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
    description: 'Product(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getProducts(
    @Query('page', new ValidatePaginationPipe()) page: number = 0,
    @Query('limit', new ValidatePaginationPipe()) limit: number = 50,
    @Query('searchCriteria', new ValidateSearchCriteriaPipe())
    searchCriteria?: string,
  ) {
    this.logger.debug('GET /product');
    const searchCriteriaObj: SearchCriteriaI = JSON.parse(
      decodeURIComponent(searchCriteria),
    );
    const response = await this.shoppingListProductService.getProducts(
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
    summary: 'Create a new product',
  })
  @ApiBody({ description: 'Product data', type: CreateShoppingListProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createProduct(@Body() product: CreateShoppingListProductDto) {
    this.logger.debug('POST /product');
    const response =
      await this.shoppingListProductService.createProduct(product);
    const formattedResponse = formatResponse(response, {
      id: response.shoppingListProductID,
    });
    return formattedResponse;
  }

  @Put('buy/:id')
  @ApiOperation({
    summary: 'Buy a product',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product bought successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async buyProduct(@Param('id') id: string) {
    this.logger.debug('PUT /shopping-list-products/buy/:id');
    const response = await this.shoppingListProductService.buyProduct(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Put('amount/:id')
  @ApiOperation({
    summary: `Update an existing product's amount`,
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiQuery({ name: 'amount', description: 'New amount', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async modifyAmount(@Param('id') id: string, @Query('amount') amount: number) {
    this.logger.debug('PUT /shopping-list-products/amount/:id');
    const response = await this.shoppingListProductService.modifyAmount(
      id,
      amount,
    );
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing product',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ description: 'Product data', type: CreateShoppingListProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateProduct(
    @Param('id') id: string,
    @Body() product: CreateShoppingListProductDto,
  ) {
    this.logger.debug('PUT /shopping-list-products/:id');
    const response = await this.shoppingListProductService.updateProduct(
      id,
      product,
    );
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing product',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteProduct(@Param('id') id: string) {
    this.logger.debug('DELETE /shopping-list-products/:id');
    await this.shoppingListProductService.deleteProduct(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
