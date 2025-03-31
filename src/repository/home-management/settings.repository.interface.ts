import { CreateSettingsDto } from '@/api/entities/dtos/home-management/settings.dto';
import { SettingsI } from '@/api/entities/interfaces/home-management.entity';
import { GenericRepository } from 'src/repository/generic-repository.interface';

export const SETTINGS_REPOSITORY = 'SETTINGS_REPOSITORY';

export interface SettingsRepository
  extends GenericRepository<SettingsI, string, CreateSettingsDto> {}
