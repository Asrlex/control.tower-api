import { CreateUserDto } from '@/api/entities/dtos/home-management/user.dto';
import { UserI } from '@/api/entities/interfaces/home-management.entity';
import { GenericRepository } from '@/common/repository/generic-repository.interface';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepository
  extends GenericRepository<UserI, string, CreateUserDto> {
  findByEmail(email: string): Promise<UserI>;
}
