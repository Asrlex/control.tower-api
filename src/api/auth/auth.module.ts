import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '@/db/database.module';
import { UserRepositoryImplementation } from './repository/user.repository';
import { USER_REPOSITORY } from './repository/user.repository.interface';
import { CompositeAuthGuard } from './guards/composite-auth.guard';
import { GlobalApiKeyGuard } from './guards/global-api-key.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    Logger,
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImplementation,
    },
    GlobalApiKeyGuard,
    JwtAuthGuard,
    CompositeAuthGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, GlobalApiKeyGuard, JwtAuthGuard, CompositeAuthGuard],
})
export class AuthModule {}
