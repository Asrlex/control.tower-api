import { IsNumber, IsString } from 'class-validator';

export class GetShiftCheckinDto {
  @IsNumber()
  shiftID: number;
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: 'CLOCK_IN' | 'CLOCK_OUT';
}

export class CreateShiftCheckinDto {
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: 'CLOCK_IN' | 'CLOCK_OUT';
}
