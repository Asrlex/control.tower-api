import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { logger } from './config/logger.config';
import { NoNullPipe } from './common/pipes/validation.pipe';
import * as bodyParser from 'body-parser';
import { Logger } from '@nestjs/common';
import { ErrorWrapperFilter } from './common/filters/errorWrapping.filter';
import * as dotenv from 'dotenv';
import { setupSwagger } from './config/swagger/swagger.config';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(logger),
  });

  setupSwagger(app);

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  app.enableCors({
    origin: 'http://localhost:5174',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-api-key',
  });

  app.useGlobalPipes(new NoNullPipe());

  app.useGlobalFilters(new ErrorWrapperFilter(app.get(Logger)));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app
    .listen(port)
    .then(() =>
      app.get(Logger).log(`Server running on http://localhost:${port}`),
    )
    .catch((error) => app.get(Logger).error('Error starting server', error));
}
bootstrap();
