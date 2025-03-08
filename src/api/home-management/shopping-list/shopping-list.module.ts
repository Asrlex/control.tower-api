import { Module, Logger, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ShoppingListProductController } from './shopping-list.controller';
import { SHOPPING_LIST_PRODUCT_REPOSITORY } from '@/repository/home-management/shopping-list.repository.interface';
import { ShoppingListProductRepositoryImplementation } from '@/repository/home-management/shopping-list.repository';
import { ShoppingListProductService } from './shopping-list.service';
import { STOCK_PRODUCT_REPOSITORY } from '@/repository/home-management/stock.repository.interface';
import { StockProductRepositoryImplementation } from '@/repository/home-management/stock.repository';
import { StockProductModule } from '../stock/stock.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => KafkaModule),
    forwardRef(() => StockProductModule),
  ],
  controllers: [ShoppingListProductController],
  providers: [
    {
      provide: STOCK_PRODUCT_REPOSITORY,
      useClass: StockProductRepositoryImplementation,
    },
    {
      provide: SHOPPING_LIST_PRODUCT_REPOSITORY,
      useClass: ShoppingListProductRepositoryImplementation,
    },
    ShoppingListProductService,
    Logger,
  ],
})
export class ShoppingListProductModule {}
