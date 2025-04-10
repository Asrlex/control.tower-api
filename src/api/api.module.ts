import { Logger, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/auth.module';
import { ApiService } from './api.service';
import { HmModule } from './home-management/hm.module';

@Module({
  controllers: [ApiController],
  imports: [AuthModule, HmModule],
  providers: [Logger, ApiService],
})
export class ApiModule {}
