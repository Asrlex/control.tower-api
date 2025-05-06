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
import { dtoValidator, formatResponse } from '@/common/utils/utils.api';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GlobalApiKeyGuard } from '@/api/auth/guards/global-api-key.guard';
import { CreateShiftDto } from '@/api/entities/dtos/home-management/shift.dto';
import { JwtAuthGuard } from '@/api/auth/guards/jwt-auth.guard';
import {
  SuccessCodes,
  ErrorCodes,
} from '@/api/entities/enums/response-codes.enum';
import { ShiftService } from './shift.service';

@ApiTags('Shifts')
@Controller()
@UseGuards(GlobalApiKeyGuard)
@UseGuards(JwtAuthGuard)
export class ShiftController {
  constructor(
    private readonly logger: Logger,
    private readonly shiftService: ShiftService,
  ) {}

  @Get('status')
  status() {
    return this.shiftService.status();
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: SuccessCodes.Ok,
    description: 'Shift(s) retrieved successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  async findAllShifts() {
    const response = await this.shiftService.findAllShifts();
    const formattedResponse = formatResponse(response.entities, {
      total: response.total,
    });
    return formattedResponse;
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get a shift by ID',
  })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({
    status: SuccessCodes.Ok,
    description: 'Shift(s) retrieved successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  async getShiftById(@Param('id') id: string) {
    const response = await this.shiftService.getShiftById(id);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Post('')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiBody({ description: 'Shift data', type: CreateShiftDto })
  @ApiResponse({
    status: SuccessCodes.Created,
    description: 'Shift created successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  async createShift(@Body() product: CreateShiftDto) {
    const response = await this.shiftService.createShift(product);
    const formattedResponse = formatResponse(response, {
      id: response.shiftID,
    });
    return formattedResponse;
  }

  @Put(':id')
  @UsePipes(dtoValidator())
  @ApiOperation({
    summary: 'Update an existing product',
  })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiBody({ description: 'Shift data', type: CreateShiftDto })
  @ApiResponse({
    status: SuccessCodes.Ok,
    description: 'Shift updated successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  async updateShift(@Param('id') id: string, @Body() product: CreateShiftDto) {
    const response = await this.shiftService.updateShift(id, product);
    const formattedResponse = formatResponse(response, { id });
    return formattedResponse;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing product',
  })
  @ApiParam({ name: 'id', description: 'Shift ID' })
  @ApiResponse({
    status: SuccessCodes.NoContent,
    description: 'Shift deleted successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  async deleteShift(@Param('id') id: string) {
    await this.shiftService.deleteShift(id);
    const formattedResponse = formatResponse(null, { id });
    return formattedResponse;
  }
}
