import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
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
import { TaskService } from './task.service';
import { CreateTaskDto } from '@/api/entities/dtos/home-management/task.dto';

@ApiTags('Tasks')
@Controller()
@UseGuards(new GlobalApiKeyGuard())
export class TaskController {
  constructor(
    private readonly logger: Logger,
    private readonly taskService: TaskService,
  ) {}

  @Get('status')
  status() {
    return this.taskService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'Task(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllTasks() {
    this.logger.debug('GET /tasks/all');
    const response = await this.taskService.getAllTasks();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get a tasks by ID',
  })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getTaskById(@Param('id') id: string) {
    this.logger.debug('GET /tasks/id/:id');
    const response = await this.taskService.getTaskById(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Get('')
  @ApiOperation({
    summary: 'Get tasks with pagination and optional search criteria',
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
    description: 'Task(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getTasks(
    @Query('page', new ValidatePaginationPipe()) page: number = 0,
    @Query('limit', new ValidatePaginationPipe()) limit: number = 50,
    @Query('searchCriteria', new ValidateSearchCriteriaPipe())
    searchCriteria?: string,
  ) {
    this.logger.debug('GET /tasks');
    const searchCriteriaObj: SearchCriteriaI = JSON.parse(
      decodeURIComponent(searchCriteria),
    );
    const response = await this.taskService.getTasks(
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
  @ApiBody({ description: 'Task data', type: CreateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createTask(@Body() product: CreateTaskDto) {
    this.logger.debug('POST /tasks');
    const response = await this.taskService.createTask(product);
    const formattedResponse = formatResponse(response, {
      id: response.taskID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing product',
  })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ description: 'Task data', type: CreateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateTask(@Param('id') id: string, @Body() product: CreateTaskDto) {
    this.logger.debug('PUT /tasks/:id');
    const response = await this.taskService.updateTask(id, product);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing product',
  })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiQuery({
    name: 'completed',
    description: 'Task completed status',
    type: 'boolean',
  })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async toggleCompletedTask(
    @Param('id') id: string,
    @Query('taskCompleted') taskCompleted: boolean,
  ) {
    this.logger.debug('PUT /tasks/complete/:id');
    const response = await this.taskService.toggleCompletedTask(
      id,
      taskCompleted,
    );
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing product',
  })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteTask(@Param('id') id: string) {
    this.logger.debug('DELETE /tasks/:id');
    await this.taskService.deleteTask(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
