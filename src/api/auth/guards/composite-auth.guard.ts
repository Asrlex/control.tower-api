import { ExecutionContext, Injectable } from '@nestjs/common';
import { GlobalApiKeyGuard } from './global-api-key.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class CompositeAuthGuard {
  constructor(
    private readonly globalApiKeyGuard: GlobalApiKeyGuard,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.globalApiKeyGuard.canActivate(context)) {
      return true;
    }
    if (await this.jwtAuthGuard.canActivate(context)) {
      return true;
    }
    return false;
  }
}
