import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('control')
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get()
  getHello(): string {
    this.logger.debug('GET /');
    return 'Hello World!';
  }
}
