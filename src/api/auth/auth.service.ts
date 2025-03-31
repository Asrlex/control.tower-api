import { UserRepository } from '@/repository/home-management/user.repository.interface';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserI } from '../entities/interfaces/home-management.entity';
import { CreateUserDto } from '../entities/dtos/home-management/user.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Método para verificar si el endpoint de autenticación esta funcionando
   * @returns string - mensaje indicando que el endpoint de autenticación esta funcionando
   */
  async status() {
    return {
      statusCode: 200,
      message: 'Auth endpoint is working',
    };
  }

  /**
   * Método para iniciar sesión
   * @param dto - usuario
   * @returns string - token de autenticación
   */
  async login(dto: CreateUserDto): Promise<{ user: UserI; token: string }> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.userEmail, sub: user.userID };
    const token = this.createToken(payload);
    return {
      user,
      token,
    };
  }

  /**
   * Método para registrar un nuevo usuario
   * @param email - email del usuario
   * @param password - contraseña del usuario
   * @returns string - usuario creado
   */
  async signup(
    signupDto: CreateUserDto,
  ): Promise<{ user: UserI; token: string }> {
    const existingUser = await this.userRepository.findByEmail(signupDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    if (!hashedPassword) {
      throw new UnauthorizedException('Password hashing failed');
    }
    signupDto.password = hashedPassword;
    const user = await this.userRepository.create(signupDto);
    if (!user) {
      throw new UnauthorizedException('User creation failed');
    }

    const payload = { email: user.userEmail, sub: user.userID };
    const token = this.createToken(payload);
    return {
      user,
      token,
    };
  }

  /**
   * Método para validar un usuario
   * @param email - email del usuario
   * @param password - contraseña del usuario
   * @returns string - usuario validado
   */
  private async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.userPassword);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  /**
   * Método para obtener el token de la petición
   * @param request - petición HTTP
   * @returns string - token de autenticación
   */
  async getTokenFromRequest(request: Request): Promise<string> {
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    return token;
  }

  /**
   * Método para verificar si el token es válido
   * @param token - token de autenticación
   * @returns string - usuario validado
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return !!decoded;
    } catch (error) {
      console.error('Error validating token', error);
      return false;
    }
  }

  /**
   * Método para obtener el usuario a partir del token
   * @param token - token de autenticación
   * @returns string - usuario validado
   */
  async getUserFromToken(token: string): Promise<UserI> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userRepository.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error getting user from token', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Método para crear un token de autenticación
   * @param payload - carga útil del token
   * @returns string - token de autenticación
   */
  private createToken(payload: any) {
    const token: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return token;
  }
}
