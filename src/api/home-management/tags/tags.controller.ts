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
import { TagService } from './tags.service';
import {
  CreateItemTagDto,
  CreateTagDto,
} from '@/api/entities/dtos/home-management/tag.dto';

@ApiTags('Tags')
@Controller()
@UseGuards(new GlobalApiKeyGuard())
export class TagController {
  constructor(
    private readonly logger: Logger,
    private readonly tagService: TagService,
  ) {}

  @Get('status')
  status() {
    return this.tagService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'Tag(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllTags() {
    this.logger.debug('GET /tags/all');
    const response = await this.tagService.getAllTags();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get a tags by ID',
  })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({
    status: 200,
    description: 'Tag(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getTagById(@Param('id') id: string) {
    this.logger.debug('GET /tags/id/:id');
    const response = await this.tagService.getTagById(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Get('')
  @ApiOperation({
    summary: 'Get tags with pagination and optional search criteria',
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
    description: 'Tag(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getTags(
    @Query('page', new ValidatePaginationPipe()) page: number = 0,
    @Query('limit', new ValidatePaginationPipe()) limit: number = 50,
    @Query('searchCriteria', new ValidateSearchCriteriaPipe())
    searchCriteria?: string,
  ) {
    this.logger.debug('GET /tags');
    const searchCriteriaObj: SearchCriteriaI = JSON.parse(
      decodeURIComponent(searchCriteria),
    );
    const response = await this.tagService.getTags(
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
    summary: 'Create a new tag',
  })
  @ApiBody({ description: 'Tag data', type: CreateTagDto })
  @ApiResponse({
    status: 200,
    description: 'Tag created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createTag(@Body() tag: CreateTagDto) {
    this.logger.debug('POST /tags');
    const response = await this.tagService.createTag(tag);
    const formattedResponse = formatResponse(response, {
      id: response.tagID,
    });
    return formattedResponse;
  }

  @Post('item')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create a new tag',
  })
  @ApiBody({ description: 'Tag data', type: CreateTagDto })
  @ApiResponse({
    status: 200,
    description: 'Tag created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createItemTag(@Body() tag: CreateItemTagDto) {
    this.logger.debug('POST /tags');
    await this.tagService.createItemTag(tag.itemID, tag.tagID.toString());
    const formattedResponse = formatResponse(null);
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing tag',
  })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiBody({ description: 'Tag data', type: CreateTagDto })
  @ApiResponse({
    status: 200,
    description: 'Tag updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateTag(@Param('id') id: string, @Body() tag: CreateTagDto) {
    this.logger.debug('PUT /tags/:id');
    const response = await this.tagService.updateTag(id, tag);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete('item')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Delete an existing tag',
  })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteItemTag(@Body() tag: CreateItemTagDto) {
    this.logger.debug('DELETE /tags/item');
    await this.tagService.deleteItemTag(tag.itemID, tag.tagID.toString());
    const formattedResponse = formatResponse(null);
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing tag',
  })
  @ApiParam({ name: 'id', description: 'Tag ID' })
  @ApiResponse({
    status: 200,
    description: 'Tag deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteTag(@Param('id') id: string) {
    this.logger.debug('DELETE /tags/:id');
    await this.tagService.deleteTag(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
