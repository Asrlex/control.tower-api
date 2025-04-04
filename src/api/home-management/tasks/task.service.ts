import {
  CreateHouseTaskDto,
  CreateTaskDto,
} from '@/api/entities/dtos/home-management/task.dto';
import { SuccessCodes } from '@/api/entities/enums/response-codes.enum';
import { SearchCriteriaI } from '@/api/entities/interfaces/api.entity';
import {
  HouseTaskI,
  TaskI,
} from '@/api/entities/interfaces/home-management.entity';
import {
  TASK_REPOSITORY,
  TaskRepository,
} from '@/repository/home-management/task.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  /**
   * Método para verificar si el endpoint de tareas esta funacionando
   * @returns string - mensaje indicando que el endpoint de tareas esta funacionando
   */
  async status() {
    return {
      statusCode: SuccessCodes.Ok,
      message: 'Task endpoint is working',
    };
  }

  /**
   * Método para obtener todos los tareas
   * @returns string - todos los tareas
   */
  async getAllTasks(): Promise<{
    entities: TaskI[];
    total: number;
  }> {
    return await this.taskRepository.findAll();
  }

  /**
   * Método para obtener todas las tareas de la casa
   * @returns string - todas las tareas de la casa
   */
  async getAllHouseTasks(): Promise<{ entities: HouseTaskI[]; total: number }> {
    return await this.taskRepository.findAllHouseTasks();
  }

  /**
   * Método para obtener lista de tareas filtrados
   * @returns string - lista de tareas filtrados
   */
  async getTasks(
    page: number,
    limit: number,
    searchCriteria: SearchCriteriaI,
  ): Promise<{
    entities: TaskI[];
    total: number;
  }> {
    return await this.taskRepository.find(page, limit, searchCriteria);
  }

  /**
   * Método para obtener una tarea por su id
   * @param id - id de la tarea
   * @returns string
   */
  async getTaskById(id: string): Promise<TaskI> {
    return await this.taskRepository.findById(id);
  }

  /**
   * Metodo para crear una nueva tarea
   * @returns string - tarea creada
   */
  async createTask(dto: CreateTaskDto): Promise<TaskI> {
    return await this.taskRepository.create(dto);
  }

  /**
   * Metodo para crear una nueva tarea
   * @returns string - tarea creada
   */
  async createHouseTask(dto: CreateHouseTaskDto): Promise<HouseTaskI> {
    return await this.taskRepository.createHouseTask(dto);
  }

  /**
   * Método para actualizar una tarea
   * @param id - id de la tarea
   * @param customer - tarea
   * @returns string - tarea actualizada
   */
  async updateTask(id: string, customer: CreateTaskDto) {
    return await this.taskRepository.modify(id, customer);
  }

  /**
   * Método para actualizar una tarea completada
   * @param id - id de la tarea
   * @param customer - tarea
   * @returns string - tarea actualizada
   */
  async toggleCompletedTask(id: string, taskCompleted: boolean) {
    return await this.taskRepository.toggleCompletedTask(id, taskCompleted);
  }

  /**
   * Método para eliminar una tarea
   * @param id - id de la tarea
   * @returns null - tarea eliminada
   */
  async deleteTask(id: string) {
    await this.taskRepository.delete(id);
  }
}
