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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/api/auth/guards/jwt-auth.guard';
import { GlobalApiKeyGuard } from '@/api/auth/guards/global-api-key.guard';
import { formatResponse } from '@/api/utils/utils.api';
import { ValidatePaginationPipe } from '@/common/pipes/pagination.pipe';
import { ValidateSearchCriteriaPipe } from '@/common/pipes/search.pipe';
import { SearchCriteriaI } from '@/api/entities/interfaces/api.entity';
import { CreateExpenseDto } from '@/api/entities/dtos/home-management/expense.dto';
import { ExpenseService } from './expenses.service';

@ApiTags('Expenses')
@Controller()
@UseGuards(GlobalApiKeyGuard)
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(
    private readonly logger: Logger,
    private readonly expenseService: ExpenseService,
  ) {}

  @Get('status')
  status() {
    return this.expenseService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({
    status: 200,
    description: 'Expense(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllExpenses() {
    this.logger.debug('GET /expenses/all');
    const response = await this.expenseService.getAllExpenses();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('all/categories')
  @ApiOperation({ summary: 'Get all expense categories' })
  @ApiResponse({
    status: 200,
    description: 'Expense(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllExpenseCategories() {
    this.logger.debug('GET /expenses/all/categories');
    const response = await this.expenseService.getAllExpenseCategories();
    const formattedResponse = formatResponse(response);
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get expense by ID',
  })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getExpenseById(id: string) {
    this.logger.debug(`GET /expenses/id/${id}`);
    const response = await this.expenseService.getExpenseById(id);
    const formattedResponse = formatResponse(response, {});
    return formattedResponse;
  }

  @Get('')
  @ApiOperation({ summary: 'Get expenses' })
  @ApiQuery({ name: 'page', description: 'Requested page', type: 'number' })
  @ApiQuery({ name: 'limit', description: 'Elements per page', type: 'number' })
  @ApiQuery({
    name: 'searchCriteria',
    description: 'Search criteria',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Expense(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getExpenses(
    @Query('page', new ValidatePaginationPipe()) page: number = 0,
    @Query('limit', new ValidatePaginationPipe()) limit: number = 50,
    @Query('searchCriteria', new ValidateSearchCriteriaPipe())
    searchCriteria?: string,
  ) {
    this.logger.debug('GET /expenses');
    const searchCriteriaObj: SearchCriteriaI = JSON.parse(
      decodeURIComponent(searchCriteria),
    );
    const response = await this.expenseService.getExpenses(
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
  @ApiOperation({ summary: 'Create expense' })
  @ApiBody({ description: 'Expense data', type: CreateExpenseDto })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createExpense(@Body() dto: CreateExpenseDto) {
    this.logger.debug('POST /expenses');
    const response = await this.expenseService.createExpense(dto);
    const formattedResponse = formatResponse(response, {
      id: response.expenseID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update expense',
  })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiBody({ description: 'Expense data', type: CreateExpenseDto })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateExpense(@Param('id') id: string, @Body() dto: CreateExpenseDto) {
    this.logger.debug(`PUT /expenses/${id}`);
    const response = await this.expenseService.updateExpense(id, dto);
    const formattedResponse = formatResponse(response, {});
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete expense',
  })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteExpense(@Param('id') id: string) {
    this.logger.debug(`DELETE /expenses/${id}`);
    const response = await this.expenseService.deleteExpense(id);
    const formattedResponse = formatResponse(response, {});
    return formattedResponse;
  }
}
