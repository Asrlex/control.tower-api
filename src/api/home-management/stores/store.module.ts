import { Module, Logger, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { StoreController } from './store.controller';
import { STORE_REPOSITORY } from '@/repository/home-management/store.repository.interface';
import { StoreRepositoryImplementation } from '@/repository/home-management/store.repository';
import { StoreService } from './store.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => KafkaModule)],
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
