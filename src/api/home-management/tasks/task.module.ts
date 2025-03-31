import { Module, Logger } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { TaskController } from './task.controller';
import { TASK_REPOSITORY } from '@/repository/home-management/task.repository.interface';
import { TaskRepositoryImplementation } from '@/repository/home-management/task.repository';
import { TaskService } from './task.service';
import { AuthModule } from '@/api/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TaskController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepositoryImplementation,
    },
    TaskService,
    Logger,
  ],
})
export class TaskModule {}
