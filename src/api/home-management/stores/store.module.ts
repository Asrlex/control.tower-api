import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { StoreController } from './store.controller';
import { STORE_REPOSITORY } from '@/repository/home-management/store.repository.interface';
import { StoreRepositoryImplementation } from '@/repository/home-management/store.repository';
import { StoreService } from './store.service';
import { AuthModule } from '@/api/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StoreController],
  providers: [
    {
      provide: STORE_REPOSITORY,
      useClass: StoreRepositoryImplementation,
    },
    StoreService,
    Logger,
  ],
})
export class StoreModule {}
