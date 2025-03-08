import { Module, Logger, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ProductController } from './products.controller';
import { PRODUCT_REPOSITORY } from '@/repository/home-management/products.repository.interface';
import { ProductRepositoryImplementation } from '@/repository/home-management/products.repository';
import { ProductService } from './products.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => KafkaModule)],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImplementation,
    },
    ProductService,
    Logger,
  ],
})
export class ProductModule {}
