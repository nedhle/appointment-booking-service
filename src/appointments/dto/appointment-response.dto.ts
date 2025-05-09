import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ description: 'Appointment status', enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  providerId: string;
}

export class AppointmentsListResponseDto {
  @ApiProperty({ description: 'List of appointments', type: [AppointmentResponseDto] })
  appointments: AppointmentResponseDto[];
}
