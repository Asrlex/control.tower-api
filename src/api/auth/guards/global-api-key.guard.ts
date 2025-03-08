import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GlobalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const validApiKey = process.env.GLOBAL_API_KEY;
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey && apiKey === validApiKey) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
