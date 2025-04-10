import { GenericRepository } from '@/common/repository/generic-repository.interface';
import { StoreI } from '@/api/entities/interfaces/home-management.entity';
import { CreateStoreDto } from '@/api/entities/dtos/home-management/store.dto';

export const STORE_REPOSITORY = 'STORE_REPOSITORY';

export interface StoreRepository
  extends GenericRepository<StoreI, string, CreateStoreDto> {}
