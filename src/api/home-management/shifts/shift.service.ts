import { SuccessCodes } from '@/api/entities/enums/response-codes.enum';
import { Inject, Injectable } from '@nestjs/common';
import {
  SHIFT_REPOSITORY,
  ShiftRepository,
} from './repository/shift.repository.interface';
import {
  ShiftI,
  UserI,
} from '@/api/entities/interfaces/home-management.entity';
import { CreateShiftCheckinDto } from '@/api/entities/dtos/home-management/shift.dto';

@Injectable()
export class ShiftService {
  constructor(
    @Inject(SHIFT_REPOSITORY)
    private readonly storeRepository: ShiftRepository,
  ) {}

  /**
   * Método para verificar si el endpoint de tiendas esta funcionando
   * @returns string - mensaje indicando que el endpoint de tiendas esta funcionando
   */
  async status() {
    return {
      statusCode: SuccessCodes.Ok,
      message: 'Shift endpoint is working',
    };
  }

  /**
   * Método para obtener todos los tiendas
   * @returns string - todos los tiendas
   */
  async findAllShifts(): Promise<{
    entities: ShiftI[];
    total: number;
  }> {
    return await this.storeRepository.findAll();
  }

  /**
   * Método para obtener una tienda por su id
   * @param id - id de la tienda
   * @returns string
   */
  async getShiftById(id: string): Promise<ShiftI> {
    return await this.storeRepository.findById(id);
  }

  /**
   * Método para obtener turnos por su mes
   * @param date - mes del turno
   * @returns string - todos los turnos
   */
  async getShiftsByMonth(month: string, user: UserI): Promise<ShiftI[]> {
    return await this.storeRepository.findByMonth(month, user);
  }

  /**
   * Metodo para crear un nuevo tienda
   * @returns string - tienda creado
   */
  async createShift(dto: CreateShiftCheckinDto, user: UserI): Promise<ShiftI> {
    return await this.storeRepository.createByUser(dto, user);
  }

  /**
   * Método para actualizar una tienda
   * @param id - id de la tienda
   * @param customer - tienda
   * @returns string - tienda actualizado
   */
  async updateShift(id: string, customer: CreateShiftCheckinDto) {
    return await this.storeRepository.modify(id, customer);
  }

  /**
   * Método para eliminar una tienda
   * @param id - id de la tienda
   * @returns null - tienda eliminado
   */
  async deleteShift(id: string) {
    await this.storeRepository.delete(id);
  }
}
