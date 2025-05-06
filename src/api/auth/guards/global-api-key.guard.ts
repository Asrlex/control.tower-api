import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthEnum, AuthMessages } from '../entities/enums/auth.enum';

@Injectable()
export class GlobalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const validApiKey = process.env.GLOBAL_API_KEY;
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers[AuthEnum.AuthAPIKey];

    if (apiKey) {
      if (apiKey === validApiKey) {
        return true;
      } else {
        throw new UnauthorizedException(AuthMessages.InvalidAPIKey);
      }
    }
    return false;
  }
}
