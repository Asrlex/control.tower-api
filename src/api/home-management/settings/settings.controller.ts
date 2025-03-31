import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SettingService } from './settings.service';
import { GlobalApiKeyGuard } from '@/api/auth/guards/global-api-key.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { dtoValidator, formatResponse } from '@/api/utils/utils.api';
import { CreateSettingsDto } from '@/api/entities/dtos/home-management/settings.dto';
import { JwtAuthGuard } from '@/api/auth/guards/jwt-auth.guard';

@ApiTags('Settingss')
@Controller()
@UseGuards(GlobalApiKeyGuard)
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(
    private readonly logger: Logger,
    private readonly settingsService: SettingService,
  ) {}

  @Get('status')
  status() {
    return this.settingsService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({
    status: 200,
    description: 'Settings retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getAllSettingss() {
    this.logger.debug('GET /settings/all');
    const response = await this.settingsService.getAllSettings();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get user settings by ID',
  })
  @ApiParam({ name: 'id', description: 'Setting ID' })
  @ApiResponse({
    status: 200,
    description: 'Setting(s) retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getSettingsById(@Param('id') id: string) {
    this.logger.debug('GET /settings/id/:id');
    const response = await this.settingsService.getSettingById(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Post('')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create new user settings',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async createSettings(@Body() dto: CreateSettingsDto) {
    this.logger.debug('POST /settings/id/:id');
    const response = await this.settingsService.createSettings(dto);
    const formattedResponse = formatResponse(response, {
      id: response.settingsID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update user settings by ID',
  })
  @ApiParam({ name: 'id', description: 'Setting ID' })
  @ApiResponse({
    status: 200,
    description: 'Setting(s) updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateSettings(
    @Param('id') id: string,
    @Body() dto: CreateSettingsDto,
  ) {
    this.logger.debug('PUT /settings/id/:id');
    const response = await this.settingsService.updateSettings(id, dto);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user settings by ID',
  })
  @ApiParam({ name: 'id', description: 'Setting ID' })
  @ApiResponse({
    status: 200,
    description: 'Setting(s) deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteSettings(@Param('id') id: string) {
    this.logger.debug('DELETE /settings/id/:id');
    const response = await this.settingsService.deleteSettings(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }
}
