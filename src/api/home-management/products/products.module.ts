import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { ProductController } from './products.controller';
import { PRODUCT_REPOSITORY } from '@/repository/home-management/products.repository.interface';
import { ProductRepositoryImplementation } from '@/repository/home-management/products.repository';
import { ProductService } from './products.service';

@Module({
  imports: [DatabaseModule],
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
