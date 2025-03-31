import { IsNumber, IsString } from 'class-validator';

export class GetSettingsDto {
  @IsNumber()
  settingsID: number;
  @IsString()
  settings: string;
  @IsNumber()
  settingsUserID: number;
  @IsString()
  settingsDateCreated: string;
  @IsString()
  settingsLastModified: string;
}

export class CreateSettingsDto {
  @IsString()
  settings: string;
  @IsNumber()
  settingsUserID: number;
}
