import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  private isKafkaConnected = false;
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    const topic = process.env.KAFKA_TOPIC || 'control-tower-insert';
    this.kafkaClient.subscribeToResponseOf(topic);
    try {
      await this.kafkaClient.connect();
      this.isKafkaConnected = true;
      this.logger.log('Connected to Kafka successfully');
    } catch (error) {
      this.isKafkaConnected = false;
      this.logger.warn(`Error connecting to Kafka: ${error}`);
    }
  }

  /**
   * Produce an event to a Kafka topic
   * @param topic - Kafka topic
   * @param message - Message to send
   */
  async sendMessage(topic: string, message: string) {
    if (!this.isKafkaConnected) {
      try {
        await this.kafkaClient.connect();
        this.isKafkaConnected = true;
        this.logger.log('Reconnected to Kafka successfully');
      } catch (error) {
        this.logger.warn(`Error reconnecting to Kafka: ${error}`);
        return;
      }
    }
    this.kafkaClient.emit(topic, message);
    this.logger.log(`Message sent to Kafka topic ${topic}`);
  }
}
