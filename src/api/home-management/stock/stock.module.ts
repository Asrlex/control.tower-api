import { Module, Logger, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { StockProductService } from './stock.service';
import { StockProductController } from './stock.controller';
import { STOCK_PRODUCT_REPOSITORY } from '@/repository/home-management/stock.repository.interface';
import { StockProductRepositoryImplementation } from '@/repository/home-management/stock.repository';
import { ShoppingListProductModule } from '../shopping-list/shopping-list.module';
import { SHOPPING_LIST_PRODUCT_REPOSITORY } from '@/repository/home-management/shopping-list.repository.interface';
import { ShoppingListProductRepositoryImplementation } from '@/repository/home-management/shopping-list.repository';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => KafkaModule),
    forwardRef(() => ShoppingListProductModule),
  ],
  controllers: [StockProductController],
  providers: [
    {
      provide: STOCK_PRODUCT_REPOSITORY,
      useClass: StockProductRepositoryImplementation,
    },
    {
      provide: SHOPPING_LIST_PRODUCT_REPOSITORY,
      useClass: ShoppingListProductRepositoryImplementation,
    },
    StockProductService,
    Logger,
  ],
  exports: [STOCK_PRODUCT_REPOSITORY],
})
export class StockProductModule {}
