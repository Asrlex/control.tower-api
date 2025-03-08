import { Module, Logger, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@/db/database.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TaskController } from './task.controller';
import { TASK_REPOSITORY } from '@/repository/home-management/task.repository.interface';
import { TaskRepositoryImplementation } from '@/repository/home-management/task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => KafkaModule)],
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
