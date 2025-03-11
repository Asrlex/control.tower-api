import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { RecipeRepositoryImplementation } from '@/repository/home-management/recipes.repository';
import { RECIPE_REPOSITORY } from '@/repository/home-management/recipes.repository.interface';
import { RecipeController } from './recipes.controller';
import { RecipeService } from './recipes.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RecipeController],
  providers: [
    {
      provide: RECIPE_REPOSITORY,
      useClass: RecipeRepositoryImplementation,
    },
    RecipeService,
    Logger,
  ],
})
export class RecipeModule {}
