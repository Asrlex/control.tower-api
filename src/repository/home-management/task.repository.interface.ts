import { GenericRepository } from 'src/repository/generic-repository.interface';
import {
  HouseTaskI,
  TaskI,
} from '@/api/entities/interfaces/home-management.entity';
import {
  CreateHouseTaskDto,
  CreateTaskDto,
} from '@/api/entities/dtos/home-management/task.dto';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

export interface TaskRepository
  extends GenericRepository<TaskI, string, CreateTaskDto> {
  toggleCompletedTask(taskID: string, taskCompleted: boolean): Promise<TaskI>;
  findAllHouseTasks(): Promise<{ entities: HouseTaskI[]; total: number }>;
  createHouseTask(dto: CreateHouseTaskDto): Promise<HouseTaskI>;
}
