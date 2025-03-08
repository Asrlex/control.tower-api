import { GenericRepository } from 'src/repository/generic-repository.interface';
import { TaskI } from '@/api/entities/interfaces/home-management.entity';
import { CreateTaskDto } from '@/api/entities/dtos/home-management/task.dto';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

export interface TaskRepository
  extends GenericRepository<TaskI, string, CreateTaskDto> {
  toggleCompletedTask(taskID: string, taskCompleted: boolean): Promise<TaskI>;
}
