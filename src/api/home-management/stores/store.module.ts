import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { AuthModule } from '@/api/auth/auth.module';
import { StoreRepositoryImplementation } from './repository/store.repository';
import { STORE_REPOSITORY } from './repository/store.repository.interface';

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
