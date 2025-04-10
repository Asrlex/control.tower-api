import { Controller, Get, Logger, Param } from '@nestjs/common';
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
}
