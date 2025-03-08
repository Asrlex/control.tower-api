import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<null> {
    // const user = await this.usersService.findOne(username);
    // if (user && user.password === pass) {
    //   return user;
    // }
    return null;
  }

  async login(user: any) {
    // const payload = { username: user.username, sub: user.id };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }
}
