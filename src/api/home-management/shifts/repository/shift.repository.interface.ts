import { CreateShiftDto } from '@/api/entities/dtos/home-management/shift.dto';
import { ShiftI } from '@/api/entities/interfaces/home-management.entity';
import { GenericRepository } from '@/common/repository/generic-repository.interface';

export const SHIFT_REPOSITORY = 'SHIFT_REPOSITORY';

export interface ShiftRepository
  extends GenericRepository<ShiftI, string, CreateShiftDto> {
  findByDate(date: string): Promise<ShiftI[]>;
}
