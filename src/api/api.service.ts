import { Injectable } from '@nestjs/common';
import { KafkaService } from '@/kafka/kafka.service';

@Injectable()
export class ApiService {
  constructor(private readonly kafkaService: KafkaService) {}

  /**
   * Método para obtener información sobre la salud de la API
   * @returns { status: string; version: string; uptime: number }
   */
  getSystemHealth(): { status: string; version: string; uptime: number } {
    return {
      status: 'API is healthy',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  /**
   * Método para forzar un error
   * @param type - tipo de error
   */
  throwError(type: string): void {
    if (type === 'sync') {
      throw new Error('Synchronous error');
    } else {
      setImmediate(() => {
        throw new Error('Asynchronous error');
      });
    }
    return;
  }

  /**
   * Método para enviar un mensaje a Kafka
   * @param topic - topico de Kafka
   * @param message - mensaje a enviar
   */
  async sendMessage(topic: string, message: string): Promise<void> {
    await this.kafkaService.sendMessage(topic, message);
    return;
  }
}
