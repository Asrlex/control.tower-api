import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthEnum, AuthMessages } from '../entities/enums/auth.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers[AuthEnum.AuthHeader]?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(AuthMessages.NoTokenProvided);
    }

    const isValid = await this.authService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException(AuthMessages.InvalidToken);
    }

    return true;
  }
}
