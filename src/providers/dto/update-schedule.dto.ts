import { IsObject, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class DaySchedule {
  @ApiProperty()
  @IsString()
  start: string;

  @ApiProperty()
  @IsString()
  end: string;
}

export class UpdateScheduleDto {
  @ApiProperty({ type: Object })
  @IsObject()
  weeklySchedule: {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
  };

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  appointmentDuration?: number;

  @ApiProperty()
  @IsString()
  timezone: string;
}
