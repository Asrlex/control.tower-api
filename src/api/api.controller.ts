import { Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorCodes, SuccessCodes } from './entities/enums/response-codes.enum';

@Controller('control')
@ApiTags('Control')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly logger: Logger,
  ) {}

  /**
   * Método para obtener información sobre la salud de la API
   * @returns Retorna un mensaje de control de la API
   * @example GET control/health
   */
  @Get('health')
  @ApiOperation({ summary: 'Get system health' })
  @ApiResponse({
    status: SuccessCodes.Ok,
    description: 'System health information',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  getSystemHealth(): { status: string; version: string; uptime: number } {
    this.logger.debug('GET control/health');
    return this.apiService.getSystemHealth();
  }

  /**
   * Método para forzar un error
   * @returns lanza un error
   * @example GET control/error
   */
  @Get('error/:type')
  @ApiOperation({ summary: 'Throw an error' })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  throwError(@Param('type') type: string): void {
    this.logger.error('GET control/error');
    this.apiService.throwError(type);
  }

  /**
   * Método para enviar un mensaje a Kafka
   * @returns Retorna un mensaje de control de la API
   * @example POST control/message
   */
  @Post('message')
  @ApiOperation({ summary: 'Send a message to Kafka' })
  @ApiResponse({
    status: SuccessCodes.Ok,
    description: 'Message sent to Kafka',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  async sendMessage(): Promise<void> {
    this.logger.debug('GET control/message');
    await this.apiService.sendMessage('control-tower-insert', 'Test message');
  }
}
