import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RescheduleAppointmentDto {
  @ApiProperty()
  @IsDateString()
  startTime: string;
}
