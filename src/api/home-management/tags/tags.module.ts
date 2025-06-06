import { Module, Logger, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TagRepositoryImplementation } from '@/repository/home-management/tag.repository';
import { TagController } from './tags.controller';
import { TagService } from './tags.service';
import { TAG_REPOSITORY } from '@/repository/home-management/tag.repository.interface';

@Module({
  imports: [DatabaseModule, forwardRef(() => KafkaModule)],
  controllers: [TagController],
  providers: [
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepositoryImplementation,
    },
    TagService,
    Logger,
  ],
})
export class TagModule {}
