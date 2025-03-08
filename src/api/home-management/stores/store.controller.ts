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
import { StoreService } from './store.service';
import { CreateStoreDto } from '@/api/entities/dtos/home-management/store.dto';

@ApiTags('Stores')
@Controller()
@UseGuards(new GlobalApiKeyGuard())
export class StoreController {
  constructor(
    private readonly logger: Logger,
    private readonly storeService: StoreService,
  ) {}

  @Get('status')
  status() {
    return this.storeService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Store(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllStores() {
    this.logger.debug('GET /stores/all');
    const response = await this.storeService.getAllStores();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get a store by ID',
  })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getStoreById(@Param('id') id: string) {
    this.logger.debug('GET /stores/id/:id');
    const response = await this.storeService.getStoreById(id);
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
    description: 'Store(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getStores(
    @Query('page', new ValidatePaginationPipe()) page: number = 0,
    @Query('limit', new ValidatePaginationPipe()) limit: number = 50,
    @Query('searchCriteria', new ValidateSearchCriteriaPipe())
    searchCriteria?: string,
  ) {
    this.logger.debug('GET /product');
    const searchCriteriaObj: SearchCriteriaI = JSON.parse(
      decodeURIComponent(searchCriteria),
    );
    const response = await this.storeService.getStores(
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
  @ApiBody({ description: 'Store data', type: CreateStoreDto })
  @ApiResponse({
    status: 200,
    description: 'Store created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createStore(@Body() product: CreateStoreDto) {
    this.logger.debug('POST /product');
    const response = await this.storeService.createStore(product);
    const formattedResponse = formatResponse(response, {
      id: response.storeID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing product',
  })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiBody({ description: 'Store data', type: CreateStoreDto })
  @ApiResponse({
    status: 200,
    description: 'Store updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateStore(@Param('id') id: string, @Body() product: CreateStoreDto) {
    this.logger.debug('PUT /stores/:id');
    const response = await this.storeService.updateStore(id, product);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing product',
  })
  @ApiParam({ name: 'id', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Store deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteStore(@Param('id') id: string) {
    this.logger.debug('DELETE /stores/:id');
    await this.storeService.deleteStore(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
