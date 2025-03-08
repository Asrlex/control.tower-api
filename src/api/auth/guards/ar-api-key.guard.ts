import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ARApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const validApiKey = process.env.AR_API_KEY;
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];

    if (apiKey && apiKey === validApiKey) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
