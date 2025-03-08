import { Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID || 'control-tower',
            brokers: [process.env.KAFKA_HOST || 'localhost:9092'],
            retry: {
              initialRetryTime: 100,
              retries: 1,
            },
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'control-tower-consumer',
          },
        },
      },
    ]),
  ],
  providers: [Logger, KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
