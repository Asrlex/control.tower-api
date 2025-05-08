import { CreateShiftCheckinDto } from '@/api/entities/dtos/home-management/shift.dto';
import {
  ShiftI,
  UserI,
} from '@/api/entities/interfaces/home-management.entity';
import { GenericRepository } from '@/common/repository/generic-repository.interface';

export const SHIFT_REPOSITORY = 'SHIFT_REPOSITORY';

export interface ShiftRepository
  extends GenericRepository<ShiftI, string, CreateShiftCheckinDto> {
  findByMonth(date: string, user: UserI): Promise<ShiftI[]>;
  createByUser(dto: CreateShiftCheckinDto, user: UserI): Promise<ShiftI>;
}
