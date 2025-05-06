/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseConnection } from 'src/db/database.connection';
import { plainToInstance } from 'class-transformer';
import { BaseRepository } from '@/common/repository/base-repository';
import { ShiftRepository } from './shift.repository.interface';
import { ShiftI } from '@/api/entities/interfaces/home-management.entity';
import { shiftQueries } from '@/db/queries/shifts.queries';
import {
  CreateShiftDto,
  GetShiftDto,
} from '@/api/entities/dtos/home-management/shift.dto';

export class ShiftRepositoryImplementation
  extends BaseRepository
  implements ShiftRepository
{
  constructor(
    @Inject('HOME_MANAGEMENT_CONNECTION')
    private readonly homeManagementDbConnection: DatabaseConnection,
    private readonly logger: Logger,
  ) {
    super(homeManagementDbConnection);
  }

  /**
   * Método para obtener todos los turnos
   * @returns string - todos los turnos
   */
  async findAll(): Promise<{
    entities: ShiftI[];
    total: number;
  }> {
    const sql = shiftQueries.findAll;
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: ShiftI[] = this.resultToShift(result);
    return {
      entities,
      total: result[0] ? parseInt(result[0].total, 10) : 0,
    };
  }

  async find(
    page: number,
    limit: number,
    searchCriteria: any,
  ): Promise<{ entities: ShiftI[]; total: number }> {
    return null;
  }

  /**
   * Método para obtener un turno por su id
   * @param id - id del turno
   * @returns string
   */
  async findById(id: string): Promise<ShiftI | null> {
    const sql = shiftQueries.findByID.replace('@id', id);
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: ShiftI[] = this.resultToShift(result);
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Método para obtener turnos por su fecha
   * @param date - fecha
   * @returns string
   */
  async findByDate(date: string): Promise<ShiftI[]> {
    const sql = shiftQueries.findByDate.replace('@id', date);
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: ShiftI[] = this.resultToShift(result);
    return entities.length > 0 ? entities : null;
  }

  /**
   * Metodo para crear un nuevo turnos
   * @returns string - turno creado
   */
  async create(dto: CreateShiftDto): Promise<ShiftI> {
    dto = this.prepareDTO(dto);
    const sqlProduct = shiftQueries.create.replace(
      '@InsertValues',
      `'${dto.shiftDate}', '${dto.shiftTimestamp}', '${dto.shiftType}'`,
    );
    const responseProduct =
      await this.homeManagementDbConnection.execute(sqlProduct);
    const shiftID = responseProduct[0].id;

    await this.saveLog('insert', 'shift', `Created shift ${shiftID}`);
    return this.findById(shiftID);
  }

  /**
   * Método para actualizar un turno
   * Si el turno no existe, se devuelve null
   * Si el turno no tiene cambios, se devuelve el turnos original
   * @param id - id del turno
   * @param product - turno
   * @returns string - turno actualizado
   */
  async modify(id: string, dto: CreateShiftDto): Promise<ShiftI> {
    const originalShift = await this.findById(id);
    if (!originalShift) {
      throw new NotFoundException('Shift ID not found');
    }
    dto = this.prepareDTO(dto);

    const sqlProduct = shiftQueries.update
      .replace('@date', dto.shiftDate)
      .replace('@timestamp', dto.shiftTimestamp)
      .replace('@type', dto.shiftType)
      .replace('@id', id);
    await this.homeManagementDbConnection.execute(sqlProduct);

    await this.saveLog('update', 'shift', `Modified shift ${id}`);
    return this.findById(id);
  }

  /**
   * Método para eliminar un turno
   * @param id - id del turno
   * @returns string - turno eliminado
   */
  async delete(id: string): Promise<void> {
    const originalShift = await this.findById(id);
    if (!originalShift) {
      throw new NotFoundException('Shift not found');
    }
    const sql = shiftQueries.delete.replace('@id', id);
    await this.homeManagementDbConnection.execute(sql);
    await this.saveLog('delete', 'shift', `Deleted shift ${id}`);
  }

  /**
   * Método para inicializar valores opcionales del DTO
   * @param dto - DTO
   * @returns DTO
   */
  private prepareDTO(dto: CreateShiftDto): CreateShiftDto {
    dto = plainToInstance(CreateShiftDto, dto, {
      exposeDefaultValues: true,
    });
    return dto;
  }

  /**
   * Método para convertir el resultado de la consulta a un array de turnos
   * @param result - resultado de la consulta
   * @returns array de turnos
   */
  private resultToShift(result: GetShiftDto[]): ShiftI[] {
    const mappedStores: Map<number, ShiftI> = new Map();
    result.forEach((record: GetShiftDto) => {
      let shift: ShiftI;
      if (mappedStores.has(record.shiftID)) {
        shift = mappedStores.get(record.shiftID);
      } else {
        shift = {
          shiftID: record.shiftID,
          shiftDate: record.shiftDate,
          shiftTimestamp: record.shiftTimestamp,
          shiftType: record.shiftType,
        };
        mappedStores.set(record.shiftID, shift);
      }
    });
    return Array.from(mappedStores.values());
  }
}
