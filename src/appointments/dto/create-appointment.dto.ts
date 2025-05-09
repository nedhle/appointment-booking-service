import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;
}
