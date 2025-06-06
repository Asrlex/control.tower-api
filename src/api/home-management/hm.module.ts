import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from '@/kafka/kafka.module';
import { forwardRef, Logger, Module } from '@nestjs/common';
import { ProductModule } from './products/products.module';
import { ShoppingListProductModule } from './shopping-list/shopping-list.module';
import { StockProductModule } from './stock/stock.module';
import { RouterModule } from '@nestjs/core';
import { PRODUCT_REPOSITORY } from '@/repository/home-management/products.repository.interface';
import { STOCK_PRODUCT_REPOSITORY } from '@/repository/home-management/stock.repository.interface';
import { SHOPPING_LIST_PRODUCT_REPOSITORY } from '@/repository/home-management/shopping-list.repository.interface';
import { ShoppingListProductRepositoryImplementation } from '@/repository/home-management/shopping-list.repository';
import { StockProductRepositoryImplementation } from '@/repository/home-management/stock.repository';
import { ProductRepositoryImplementation } from '@/repository/home-management/products.repository';
import { StoreModule } from './stores/store.module';
import { STORE_REPOSITORY } from '@/repository/home-management/store.repository.interface';
import { StoreRepositoryImplementation } from '@/repository/home-management/store.repository';
import { TASK_REPOSITORY } from '@/repository/home-management/task.repository.interface';
import { TaskRepositoryImplementation } from '@/repository/home-management/task.repository';
import { TaskModule } from './tasks/task.module';
import { TagModule } from './tags/tags.module';
import { TagRepositoryImplementation } from '@/repository/home-management/tag.repository';
import { TAG_REPOSITORY } from '@/repository/home-management/tag.repository.interface';

@Module({
  imports: [
    DatabaseModule,
    KafkaModule,
    ProductModule,
    forwardRef(() => StockProductModule),
    forwardRef(() => ShoppingListProductModule),
    StoreModule,
    TaskModule,
    TagModule,
    RouterModule.register([
      {
        path: 'home-management',
        module: HmModule,
        children: [
          {
            path: 'products',
            module: ProductModule,
          },
          {
            path: 'stock-products',
            module: StockProductModule,
          },
          {
            path: 'shopping-list-products',
            module: ShoppingListProductModule,
          },
          {
            path: 'stores',
            module: StoreModule,
          },
          {
            path: 'tasks',
            module: TaskModule,
          },
          {
            path: 'tags',
            module: TagModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImplementation,
    },
    {
      provide: STOCK_PRODUCT_REPOSITORY,
      useClass: StockProductRepositoryImplementation,
    },
    {
      provide: SHOPPING_LIST_PRODUCT_REPOSITORY,
      useClass: ShoppingListProductRepositoryImplementation,
    },
    {
      provide: STORE_REPOSITORY,
      useClass: StoreRepositoryImplementation,
    },
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryImplementation,
    },
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepositoryImplementation,
    },
  ],
})
export class HmModule {}
