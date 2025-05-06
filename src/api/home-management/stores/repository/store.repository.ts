import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseConnection } from 'src/db/database.connection';
import { SortI } from 'src/api/entities/interfaces/api.entity';
import { plainToInstance } from 'class-transformer';
import {
  CreateStoreDto,
  GetStoreDto,
} from '@/api/entities/dtos/home-management/store.dto';
import { StoreI } from '@/api/entities/interfaces/home-management.entity';
import { BaseRepository } from '@/common/repository/base-repository';
import { StoreRepository } from './store.repository.interface';
import { storesQueries } from '@/db/queries/shops.queries';

export class StoreRepositoryImplementation
  extends BaseRepository
  implements StoreRepository
{
  constructor(
    @Inject('HOME_MANAGEMENT_CONNECTION')
    private readonly homeManagementDbConnection: DatabaseConnection,
    private readonly logger: Logger,
  ) {
    super(homeManagementDbConnection);
  }

  /**
   * Método para obtener todos las tiendas
   * @returns string - todos las tiendas
   */
  async findAll(): Promise<{
    entities: StoreI[];
    total: number;
  }> {
    const sql = storesQueries.findAll;
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: StoreI[] = this.resultToStore(result);
    return {
      entities,
      total: result[0] ? parseInt(result[0].total, 10) : 0,
    };
  }

  /**
   * Método para obtener lista de tiendas filtradas
   * @returns string - lista de tiendas filtradas
   */
  async find(
    page: number,
    limit: number,
    searchCriteria: any,
  ): Promise<{ entities: StoreI[]; total: number }> {
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
    const sql = storesQueries.find
      .replaceAll('@DynamicWhereClause', filters)
      .replaceAll('@DynamicOrderByField', `${sort.field}`)
      .replaceAll('@DynamicOrderByDirection', `${sort.order}`)
      .replace('@start', offset.toString())
      .replace('@end', limit.toString());
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: StoreI[] = this.resultToStore(result);
    return {
      entities,
      total: result[0] ? parseInt(result[0].total, 10) : 0,
    };
  }

  /**
   * Método para obtener un tiendas por su id
   * @param id - id del tiendas
   * @returns string
   */
  async findById(id: string): Promise<StoreI | null> {
    const sql = storesQueries.findByID.replace('@id', id);
    const result = await this.homeManagementDbConnection.execute(sql);
    const entities: StoreI[] = this.resultToStore(result);
    return entities.length > 0 ? entities[0] : null;
  }

  /**
   * Metodo para crear un nuevo tiendas
   * @returns string - tiendas creado
   */
  async create(dto: CreateStoreDto): Promise<StoreI> {
    dto = this.prepareDTO(dto);
    const sqlProduct = storesQueries.create.replace(
      '@InsertValues',
      `'${dto.storeName}'`,
    );
    const responseProduct =
      await this.homeManagementDbConnection.execute(sqlProduct);
    const storeID = responseProduct[0].id;

    await this.saveLog('insert', 'store', `Created store ${storeID}`);
    return this.findById(storeID);
  }

  /**
   * Método para actualizar un tiendas
   * Si el tiendas no existe, se devuelve null
   * Si el tiendas no tiene cambios, se devuelve el tiendas original
   * @param id - id del tiendas
   * @param product - tiendas
   * @returns string - tiendas actualizado
   */
  async modify(id: string, dto: CreateStoreDto): Promise<StoreI> {
    const originalProduct = await this.findById(id);
    if (!originalProduct) {
      throw new NotFoundException('Product not found');
    }
    dto = this.prepareDTO(dto);

    const sqlProduct = storesQueries.update
      .replace('@name', dto.storeName)
      .replace('@id', id);
    await this.homeManagementDbConnection.execute(sqlProduct);

    await this.saveLog('update', 'store', `Modified store ${id}`);
    return this.findById(id);
  }

  /**
   * Método para eliminar un tiendas
   * @param id - id del tiendas
   * @returns string - tiendas eliminada
   */
  async delete(id: string): Promise<void> {
    const originalProduct = await this.findById(id);
    if (!originalProduct) {
      throw new NotFoundException('Product not found');
    }
    const sql = storesQueries.delete.replace('@id', id);
    await this.homeManagementDbConnection.execute(sql);
    await this.saveLog('delete', 'store', `Deleted store ${id}`);
  }

  /**
   * Método para inicializar valores opcionales del DTO
   * @param dto - DTO
   * @returns DTO
   */
  private prepareDTO(dto: CreateStoreDto): CreateStoreDto {
    dto = plainToInstance(CreateStoreDto, dto, {
      exposeDefaultValues: true,
    });
    return dto;
  }

  /**
   * Método para convertir el resultado de la consulta a un array de tiendas
   * @param result - resultado de la consulta
   * @returns array de tiendas
   */
  private resultToStore(result: GetStoreDto[]): StoreI[] {
    const mappedStores: Map<number, StoreI> = new Map();
    result.forEach((record: GetStoreDto) => {
      let store: StoreI;
      if (mappedStores.has(record.storeID)) {
        store = mappedStores.get(record.storeID);
      } else {
        store = {
          storeID: record.storeID,
          storeName: record.storeName,
        };
        mappedStores.set(record.storeID, store);
      }
    });
    return Array.from(mappedStores.values());
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
        AND (storeName LIKE '%${search}%')
        `;
    }
    return filters;
  }
}
