import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { WeeklySchedule } from '../models/provider.model';

export class CreateProviderDto {
  @ApiProperty({ description: 'Weekly schedule for the provider', required: false })
  @IsOptional()
  weeklySchedule?: WeeklySchedule;

  @ApiProperty({ description: 'Duration of appointments in minutes', required: false, default: 30 })
  @IsNumber()
  @IsOptional()
  appointmentDuration?: number;

  @ApiProperty({ description: 'Provider timezone', required: false, default: 'UTC' })
  @IsString()
  @IsOptional()
  timezone?: string;
}
