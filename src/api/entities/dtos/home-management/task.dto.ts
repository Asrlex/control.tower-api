import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsOptional()
  taskID: number;
  @IsString()
  taskTitle: string;
  @IsString()
  taskDescription: string;
  @IsBoolean()
  @IsOptional()
  taskCompleted: boolean;
}

export class GetTaskDto {
  @IsNumber()
  taskID: number;
  @IsString()
  taskTitle: string;
  @IsString()
  taskDescription: string;
  @IsBoolean()
  taskCompleted: boolean;
  @IsString()
  taskCompletedAt: string;
  @IsString()
  taskDateCreated: string;
  @IsString()
  taskDateModified: string;
  @IsNumber()
  taskTagID: number;
  @IsString()
  taskTagName: string;
  @IsString()
  taskTagType: string;
}
