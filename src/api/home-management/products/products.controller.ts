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
import { ProductService } from './products.service';
import { CreateProductDto } from '@/api/entities/dtos/home-management/product.dto';

@ApiTags('Products')
@Controller()
@UseGuards(new GlobalApiKeyGuard())
export class ProductController {
  constructor(
    private readonly logger: Logger,
    private readonly productService: ProductService,
  ) {}

  @Get('status')
  status() {
    return this.productService.status();
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
    this.logger.debug('GET /products/all');
    const response = await this.productService.getAllProducts();
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
    this.logger.debug('GET /products/id/:id');
    const response = await this.productService.getProductById(id);
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
    const response = await this.productService.getProducts(
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

  @Get('order/:type')
  @ApiOperation({
    summary: 'Get order of products',
  })
  @ApiParam({ name: 'type', description: 'Order type' })
  @ApiResponse({
    status: 200,
    description: 'Product order retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getOrderProducts(@Param('type') type: string) {
    this.logger.debug('GET /products/order/:type');
    const response = await this.productService.getOrderProducts(type);
    const formattedResponse = formatResponse(response, { id: type });
    return formattedResponse;
  }

  @Post('order/:type')
  @ApiOperation({
    summary: 'Post order of products',
  })
  @ApiParam({ name: 'type', description: 'Order type' })
  @ApiBody({ description: 'Order data', type: [String] })
  @ApiResponse({
    status: 200,
    description: 'Product order sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async postOrderProducts(
    @Param('type') type: string,
    @Body() order: string[],
  ) {
    this.logger.debug('POST /products/order/:type');
    const response = await this.productService.postOrderProducts(type, order);
    const formattedResponse = formatResponse(response, { id: type });
    return formattedResponse;
  }

  @Post('')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiBody({ description: 'Product data', type: CreateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createProduct(@Body() product: CreateProductDto) {
    this.logger.debug('POST /product');
    const response = await this.productService.createProduct(product);
    const formattedResponse = formatResponse(response, {
      id: response.productID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing product',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiBody({ description: 'Product data', type: CreateProductDto })
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
    @Body() product: CreateProductDto,
  ) {
    this.logger.debug('PUT /products/:id');
    const response = await this.productService.updateProduct(id, product);
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
    this.logger.debug('DELETE /products/:id');
    await this.productService.deleteProduct(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
