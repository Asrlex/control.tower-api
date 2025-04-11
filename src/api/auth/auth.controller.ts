import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Req,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../entities/dtos/home-management/user.dto';
import { formatResponse } from '../../common/utils/utils.api';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GlobalApiKeyGuard } from './guards/global-api-key.guard';
import { Request } from 'express';
import {
  SuccessCodes,
  ErrorCodes,
} from '../entities/enums/response-codes.enum';
import { AuthMessages } from './entities/enums/auth.enum';

@Controller('auth')
@ApiTags('Auth')
@UseGuards(new GlobalApiKeyGuard())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Post('status')
  async status() {
    return this.authService.status();
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User credentials',
    required: true,
  })
  @ApiResponse({
    status: SuccessCodes.Created,
    description: 'User logged in successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  @ApiResponse({
    status: ErrorCodes.InternalServerError,
    description: 'Internal Server Error',
  })
  async login(@Body() loginDto: CreateUserDto) {
    const response = await this.authService.login(loginDto);
    if (!response) {
      throw new UnauthorizedException(AuthMessages.InvalidCredentials);
    }
    const formattedResponse = formatResponse(response);
    return formattedResponse;
  }

  @Post('signup')
  @ApiOperation({ summary: 'Signup' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User credentials',
    required: true,
  })
  @ApiResponse({
    status: SuccessCodes.Created,
    description: 'User signed up successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  @ApiResponse({
    status: ErrorCodes.InternalServerError,
    description: 'Internal Server Error',
  })
  async signup(@Body() signupDto: CreateUserDto) {
    const response = await this.authService.signup(signupDto);
    if (!response) {
      throw new UnauthorizedException(AuthMessages.InvalidCredentials);
    }
    const formattedResponse = formatResponse(response);
    return formattedResponse;
  }

  @Get('me')
  @ApiOperation({ summary: 'Validate token' })
  @ApiResponse({
    status: SuccessCodes.Ok,
    description: 'Token validated successfully',
  })
  @ApiResponse({ status: ErrorCodes.BadRequest, description: 'Bad Request' })
  @ApiResponse({ status: ErrorCodes.Unauthorized, description: 'Unauthorized' })
  @ApiResponse({ status: ErrorCodes.Forbidden, description: 'Forbidden' })
  @ApiResponse({ status: ErrorCodes.NotFound, description: 'Not Found' })
  @ApiResponse({
    status: ErrorCodes.InternalServerError,
    description: 'Internal Server Error',
  })
  async validate(@Req() req: Request) {
    const token = await this.authService.getTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedException(AuthMessages.NoTokenProvided);
    }
    const response = await this.authService.validateToken(token);
    if (!response) {
      throw new UnauthorizedException(AuthMessages.InvalidToken);
    }
    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      throw new UnauthorizedException(AuthMessages.UserNotFound);
    }
    const formattedResponse = formatResponse(user);
    return formattedResponse;
  }
}
