import { IsNumber, IsString } from 'class-validator';

export class GetUserDto {
  @IsNumber()
  userID: number;
  @IsString()
  userEmail: string;
  @IsString()
  userPassword: string;
  @IsString()
  userDateCreated: string;
  @IsString()
  userDateModified: string;
  @IsString()
  userDateLastLogin: string;
}

export class CreateUserDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
