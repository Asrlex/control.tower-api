/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../../common/repository/base-repository';
import { DatabaseConnection } from '@/db/database.connection';
import {
  CreateUserDto,
  GetUserDto,
} from '@/api/entities/dtos/home-management/user.dto';
import { UserI } from '@/api/entities/interfaces/home-management.entity';
import { UserRepository } from './user.repository.interface';
import { usersQueries } from '@/db/queries/users.queries';

export class UserRepositoryImplementation
  extends BaseRepository
  implements UserRepository
{
  constructor(
    @Inject('HOME_MANAGEMENT_CONNECTION')
    private readonly homeManagementDbConnection: DatabaseConnection,
    private readonly logger: Logger,
  ) {
    super(homeManagementDbConnection);
  }

  /**
   * Método para obtener todos los usuarios
   * @returns string - todos los usuarios
   */
  async findAll(): Promise<{
    entities: any[];
    total: number;
  }> {
    const sql = usersQueries.findAll;
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: UserI[] = this.resultToUser(result);
    return {
      entities,
      total: result[0] ? parseInt(result[0].total, 10) : 0,
    };
  }

  /**
   * Método para obtener un usuario por su ID
   * @param id - ID del usuario
   * @returns string - usuario
   */
  async findById(id: string): Promise<UserI> {
    const sql = usersQueries.findByID.replace('@id', id);
    const result = await this.homeManagementDbConnection.execute(sql);
    if (result.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const entities: UserI[] = this.resultToUser(result);
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Método para obtener un usuario por su email
   * @param userEmail - email del usuario
   * @returns string - usuario
   */
  async findByEmail(userEmail: string): Promise<UserI> {
    const sql = usersQueries.findByEmail;
    const result = await this.homeManagementDbConnection.execute(sql, [
      userEmail,
    ]);
    const entities: UserI[] = this.resultToUser(result);
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Método para crear un usuario
   * @param user - usuario a crear
   * @returns string - usuario creado
   */
  async create(dto: CreateUserDto): Promise<UserI> {
    const sql = usersQueries.create.replace(
      '@InsertValues',
      `'${dto.email}', '${dto.password}'`,
    );
    const result = await this.homeManagementDbConnection.execute(sql);
    const userID = result[0].id;

    await this.saveLog('insert', 'user', `Created user ${userID}`);
    return this.findById(userID);
  }

  /**
   * Método para actualizar un usuario
   * @param user - usuario a actualizar
   * @returns string - usuario actualizado
   */
  async modify(id: string, dto: CreateUserDto): Promise<UserI> {
    const originalUser = await this.findById(id);
    if (!originalUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const sql = usersQueries.update
      .replace('@userEmail', dto.email)
      .replace('@userPassword', dto.password);
    await this.homeManagementDbConnection.execute(sql);
    await this.saveLog('update', 'user', `Updated user ${id}`);
    return this.findById(id);
  }

  /**
   * Método para eliminar un usuario
   * @param id - ID del usuario a eliminar
   * @returns string - usuario eliminado
   */
  async delete(id: string): Promise<void> {
    const originalUser = await this.findById(id);
    if (!originalUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const sql = usersQueries.delete.replace('@id', id);
    await this.homeManagementDbConnection.execute(sql);
    await this.saveLog('delete', 'user', `Deleted user ${id}`);
  }

  /**
   * Método para convertir el resultado de la consulta a un array de usuarios
   * @param result - resultado de la consulta
   * @returns array de usuarios
   */
  private resultToUser(result: GetUserDto[]): UserI[] {
    const users: UserI[] = result.map((record: GetUserDto) => {
      return {
        userID: record.userID,
        userName: record.userName,
        userEmail: record.userEmail,
        userPassword: record.userPassword,
        userDateCreated: record.userDateCreated,
        userLastModified: record.userDateModified,
        userLastLogin: record.userDateLastLogin,
      };
    });
    return users;
  }

  find(
    page: number,
    limit: number,
    searchCriteria: any,
  ): Promise<{ entities: UserI[]; total: number }> {
    throw new Error('Method not implemented.');
  }
}
