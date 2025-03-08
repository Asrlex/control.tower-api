import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Método para obtener el estado de la API
   * @returns Retorna un mensaje de estado de la API
   */
  getAPIStatus(): string {
    return `The API is running!`;
  }
}
