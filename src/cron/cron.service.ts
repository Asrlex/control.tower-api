import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduledTaskService {
  constructor(private readonly logger: Logger) {}

  @Cron('0 0 0 * * *', {
    name: 'daily-task',
    timeZone: 'Europe/Madrid',
  })
  async runDailyTask(): Promise<void> {
    this.logger.log('Scheduled task running');
  }
}
