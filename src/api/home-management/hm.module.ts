import { DatabaseModule } from '@/db/database.module';
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
import { RecipeModule } from './recipes/recipes.module';
import { RECIPE_REPOSITORY } from '@/repository/home-management/recipes.repository.interface';
import { RecipeRepositoryImplementation } from '@/repository/home-management/recipes.repository';
import { SettingsModule } from './settings/settings.module';
import { SETTINGS_REPOSITORY } from '@/repository/home-management/settings.repository.interface';
import { SettingsRepositoryImplementation } from '@/repository/home-management/settings.repository';

@Module({
  imports: [
    DatabaseModule,
    ProductModule,
    forwardRef(() => StockProductModule),
    forwardRef(() => ShoppingListProductModule),
    StoreModule,
    TaskModule,
    TagModule,
    RecipeModule,
    SettingsModule,
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
          {
            path: 'recipes',
            module: RecipeModule,
          },
          {
            path: 'settings',
            module: SettingsModule,
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
    {
      provide: RECIPE_REPOSITORY,
      useClass: RecipeRepositoryImplementation,
    },
    {
      provide: SETTINGS_REPOSITORY,
      useClass: SettingsRepositoryImplementation,
    },
  ],
})
export class HmModule {}
