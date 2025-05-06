import { IsNumber, IsString } from 'class-validator';

export class GetShiftDto {
  @IsNumber()
  shiftID: number;
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: 'CLOCK_IN' | 'CLOCK_OUT';
}

export class CreateShiftDto {
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: 'CLOCK_IN' | 'CLOCK_OUT';
}
