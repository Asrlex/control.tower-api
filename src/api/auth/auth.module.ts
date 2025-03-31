import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { USER_REPOSITORY } from '@/repository/home-management/user.repository.interface';
import { UserRepositoryImplementation } from '@/repository/home-management/user.repository';
import { DatabaseModule } from '@/db/database.module';

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
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
