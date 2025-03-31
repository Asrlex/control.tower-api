import { CreateSettingsDto } from '@/api/entities/dtos/home-management/settings.dto';
import { SettingsI } from '@/api/entities/interfaces/home-management.entity';
import {
  SETTINGS_REPOSITORY,
  SettingsRepository,
} from '@/repository/home-management/settings.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SettingService {
  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: SettingsRepository,
  ) {}

  /**
   * Método para verificar si el endpoint de ajustes esta funcionando
   * @returns string - mensaje indicando que el endpoint de ajustes esta funcionando
   */
  async status() {
    return {
      statusCode: 200,
      message: 'Setting endpoint is working',
    };
  }

  /**
   * Método para obtener todos los ajustes
   * @returns string - todos los ajustes
   */
  async getAllSettings(): Promise<{
    entities: SettingsI[];
    total: number;
  }> {
    return await this.settingsRepository.findAll();
  }

  /**
   * Método para obtener un ajuste por su id
   * @param id - id del ajuste
   * @returns string
   */
  async getSettingById(id: string): Promise<SettingsI> {
    return await this.settingsRepository.findById(id);
  }

  /**
   * Metodo para crear un nuevo ajuste
   * @returns string - ajuste creado
   */
  async createSettings(dto: CreateSettingsDto): Promise<SettingsI> {
    return await this.settingsRepository.create(dto);
  }

  /**
   * Método para actualizar un ajuste
   * @param id - id del ajuste
   * @param customer - ajuste
   * @returns string - ajuste actualizado
   */
  async updateSettings(id: string, customer: CreateSettingsDto) {
    return await this.settingsRepository.modify(id, customer);
  }

  /**
   * Método para eliminar un ajuste
   * @param id - id del ajuste
   * @returns null - ajuste eliminado
   */
  async deleteSettings(id: string) {
    await this.settingsRepository.delete(id);
  }
}
