import { CreateStoreDto } from '@/api/entities/dtos/home-management/store.dto';
import { SuccessCodes } from '@/api/entities/enums/response-codes.enum';
import { SearchCriteriaI } from '@/api/entities/interfaces/api.entity';
import { StoreI } from '@/api/entities/interfaces/home-management.entity';
import {
  STORE_REPOSITORY,
  StoreRepository,
} from '@/repository/home-management/store.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class StoreService {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: StoreRepository,
  ) {}

  /**
   * Método para verificar si el endpoint de tiendas esta funcionando
   * @returns string - mensaje indicando que el endpoint de tiendas esta funcionando
   */
  async status() {
    return {
      statusCode: SuccessCodes.Ok,
      message: 'Store endpoint is working',
    };
  }

  /**
   * Método para obtener todos los tiendas
   * @returns string - todos los tiendas
   */
  async getAllStores(): Promise<{
    entities: StoreI[];
    total: number;
  }> {
    return await this.storeRepository.findAll();
  }

  /**
   * Método para obtener lista de tiendas filtrados
   * @returns string - lista de tiendas filtrados
   */
  async getStores(
    page: number,
    limit: number,
    searchCriteria: SearchCriteriaI,
  ): Promise<{
    entities: StoreI[];
    total: number;
  }> {
    return await this.storeRepository.find(page, limit, searchCriteria);
  }

  /**
   * Método para obtener una tienda por su id
   * @param id - id de la tienda
   * @returns string
   */
  async getStoreById(id: string): Promise<StoreI> {
    return await this.storeRepository.findById(id);
  }

  /**
   * Metodo para crear un nuevo tienda
   * @returns string - tienda creado
   */
  async createStore(dto: CreateStoreDto): Promise<StoreI> {
    return await this.storeRepository.create(dto);
  }

  /**
   * Método para actualizar una tienda
   * @param id - id de la tienda
   * @param customer - tienda
   * @returns string - tienda actualizado
   */
  async updateStore(id: string, customer: CreateStoreDto) {
    return await this.storeRepository.modify(id, customer);
  }

  /**
   * Método para eliminar una tienda
   * @param id - id de la tienda
   * @returns null - tienda eliminado
   */
  async deleteStore(id: string) {
    await this.storeRepository.delete(id);
  }
}
