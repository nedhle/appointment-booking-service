import { ApiProperty } from '@nestjs/swagger';
import { WeeklySchedule } from '../models/provider.model';

export class ProviderResponseDto {
  @ApiProperty({ description: 'Provider data' })
  id: string;

  @ApiProperty({ description: 'Provider weekly schedule' })
  weeklySchedule: WeeklySchedule;

  @ApiProperty({ description: 'Duration of appointments in minutes' })
  appointmentDuration: number;

  @ApiProperty({ description: 'Provider timezone' })
  timezone: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class ProvidersListResponseDto {
  @ApiProperty({ description: 'List of providers', type: [ProviderResponseDto] })
  providers: ProviderResponseDto[];
}

export class ProviderAvailabilityResponseDto {
  @ApiProperty({ description: 'Provider ID' })
  providerId: string;

  @ApiProperty({ description: 'Date for availability check' })
  date: string;

  @ApiProperty({ description: 'List of available time slots' })
  availableSlots: string[];

  @ApiProperty({ description: 'Provider timezone' })
  timezone: string;
}
