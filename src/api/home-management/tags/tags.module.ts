import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { TagRepositoryImplementation } from '@/repository/home-management/tag.repository';
import { TagController } from './tags.controller';
import { TagService } from './tags.service';
import { TAG_REPOSITORY } from '@/repository/home-management/tag.repository.interface';
import { AuthModule } from '@/api/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
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
