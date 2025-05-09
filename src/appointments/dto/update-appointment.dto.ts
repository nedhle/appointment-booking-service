import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDate, IsString, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @ApiProperty({ description: 'Start time of appointment' })
  @IsOptional()
  @IsDate()
  startTime?: Date;

  @ApiProperty({ description: 'End time of appointment' })
  @IsOptional()
  @IsDate()
  endTime?: Date;

  @ApiProperty({ description: 'Patient ID' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ description: 'Provider ID' })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
