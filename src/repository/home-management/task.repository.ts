import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseConnection } from 'src/db/database.connection';
import { SortI } from 'src/api/entities/interfaces/api.entity';
import { BaseRepository } from 'src/repository/base-repository';
import { plainToInstance } from 'class-transformer';
import { TaskRepository } from './task.repository.interface';
import { TaskI } from '@/api/entities/interfaces/home-management.entity';
import { tasksQueries } from '@/db/queries/home-management.queries';
import {
  CreateTaskDto,
  GetTaskDto,
} from '@/api/entities/dtos/home-management/task.dto';

export class TaskRepositoryImplementation
  extends BaseRepository
  implements TaskRepository
{
  constructor(
    @Inject('HOME_MANAGEMENT_CONNECTION')
    private readonly homeManagementDbConnection: DatabaseConnection,
    private readonly logger: Logger,
  ) {
    super(homeManagementDbConnection);
  }

  /**
   * Método para obtener todos las tareas
   * @returns string - todos las tareas
   */
  async findAll(): Promise<{
    entities: TaskI[];
    total: number;
  }> {
    const sql = tasksQueries.getAll;
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: TaskI[] = this.resultToTask(result);
    return {
      entities,
      total: result[0] ? parseInt(result[0].total, 10) : 0,
    };
  }

  /**
   * Método para obtener lista de tareas filtradas
   * @returns string - lista de tareas filtradas
   */
  async find(
    page: number,
    limit: number,
    searchCriteria: any,
  ): Promise<{ entities: TaskI[]; total: number }> {
    let filters = '';
    let sort: SortI = { field: 'customerName', order: 'DESC' };
    if (searchCriteria) {
      const sqlFilters = this.filterstoSQL(searchCriteria);
      filters = this.addSearchToFilters(
        sqlFilters.filters,
        searchCriteria.search,
      );
      sort = sqlFilters.sort || sort;
    }
    const offset: number = page * limit + 1;
    limit = offset + parseInt(limit.toString(), 10) - 1;
    const sql = tasksQueries.get
      .replaceAll('@DynamicWhereClause', filters)
      .replaceAll('@DynamicOrderByField', `${sort.field}`)
      .replaceAll('@DynamicOrderByDirection', `${sort.order}`)
      .replace('@start', offset.toString())
      .replace('@end', limit.toString());
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: TaskI[] = this.resultToTask(result);
    return {
      entities,
      total: result[0] ? parseInt(result[0].total, 10) : 0,
    };
  }

  /**
   * Método para obtener un tarea por su id
   * @param id - id de la tarea
   * @returns string
   */
  async findById(id: string): Promise<TaskI | null> {
    const sql = tasksQueries.getOne.replace('@id', id);
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: TaskI[] = this.resultToTask(result);
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Metodo para crear un nuevo tarea
   * @returns string - tarea creada
   */
  async create(dto: CreateTaskDto): Promise<TaskI> {
    dto = this.prepareDTO(dto);
    const sqlTask = tasksQueries.create.replace(
      '@InsertValues',
      `'${dto.taskTitle}', '${dto.taskDescription}'`,
    );
    const responseTask = await this.homeManagementDbConnection.execute(sqlTask);
    const taskID = responseTask[0].id;

    await this.saveLog('insert', 'task', `Created task ${taskID}`);
    return this.findById(taskID);
  }

  /**
   * Método para actualizar una tarea
   * Si la tarea no existe, se devuelve null
   * Si la tarea no tiene cambios, se devuelve la tarea original
   * @param id - id de la tarea
   * @param product - tarea
   * @returns string - tarea actualizada
   */
  async modify(id: string, dto: CreateTaskDto): Promise<TaskI> {
    const originalTask = await this.findById(id);
    if (!originalTask) {
      throw new NotFoundException('Task not found');
    }
    dto = this.prepareDTO(dto);

    const sqlTask = tasksQueries.update
      .replace('@title', dto.taskTitle)
      .replace('@description', dto.taskDescription)
      .replace('@id', id);
    await this.homeManagementDbConnection.execute(sqlTask);

    await this.saveLog('update', 'task', `Modified task ${id}`);
    return this.findById(id);
  }

  /**
   * Método para actualizar una tarea completada
   * @param id - id de la tarea
   * @param product - tarea
   * @returns string - tarea actualizada
   */
  async toggleCompletedTask(
    id: string,
    taskCompleted: string | boolean,
  ): Promise<TaskI> {
    const originalTask = await this.findById(id);
    if (!originalTask) {
      throw new NotFoundException('Task not found');
    }
    const sqlTask = tasksQueries.toggleCompletedTask
      .replace('@completed', taskCompleted === 'true' ? '1' : '0')
      .replace(
        '@completedAt',
        taskCompleted === 'true' ? 'CURRENT_TIMESTAMP' : 'NULL',
      )
      .replace('@id', id);
    await this.homeManagementDbConnection.execute(sqlTask);

    await this.saveLog('update', 'task', `Modified task ${id}`);
    return this.findById(id);
  }

  /**
   * Método para eliminar un tarea
   * @param id - id de la tarea
   * @returns string - tarea eliminada
   */
  async delete(id: string): Promise<void> {
    const originalTask = await this.findById(id);
    if (!originalTask) {
      throw new NotFoundException('Task not found');
    }
    const sql = tasksQueries.delete.replace('@id', id);
    await this.homeManagementDbConnection.execute(sql);
    await this.saveLog('delete', 'task', `Deleted task ${id}`);
  }

  /**
   * Método para inicializar valores opcionales del DTO
   * @param dto - DTO
   * @returns DTO
   */
  private prepareDTO(dto: CreateTaskDto): CreateTaskDto {
    dto = plainToInstance(CreateTaskDto, dto, {
      exposeDefaultValues: true,
    });
    return dto;
  }

  /**
   * Método para convertir el resultado de la consulta a un array de tareas
   * @param result - resultado de la consulta
   * @returns array de tareas
   */
  private resultToTask(result: GetTaskDto[]): TaskI[] {
    const mappedTask: Map<number, TaskI> = new Map();
    result.forEach((record: GetTaskDto) => {
      let task: TaskI;
      if (mappedTask.has(record.taskID)) {
        task = mappedTask.get(record.taskID);
      } else {
        task = {
          taskID: record.taskID,
          taskTitle: record.taskTitle,
          taskDescription: record.taskDescription,
          taskCompleted: record.taskCompleted,
          taskCompletedAt: record.taskCompletedAt,
          taskDateCreated: record.taskDateCreated,
          taskDateModified: record.taskDateModified,
          tags: [],
        };
        mappedTask.set(record.taskID, task);

        if (record.taskTagID) {
          task.tags.push({
            tagID: record.taskTagID,
            tagName: record.taskTagName,
            tagType: record.taskTagType,
          });
        }
      }
    });
    return Array.from(mappedTask.values());
  }

  /**
   * Método para añadir los criterios de búsqueda a los filtros
   * @param filters - filtros
   * @param search - criterios de búsqueda
   * @returns filtros con criterios de búsqueda
   */
  private addSearchToFilters(filters: string, search: string): string {
    if (search) {
      filters += ` 
        AND (taskTitle LIKE '%${search}%')
        `;
    }
    return filters;
  }
}
