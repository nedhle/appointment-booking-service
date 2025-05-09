import { Controller, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@ApiTags('appointments')
@Controller('api/appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 409, description: 'Time slot is not available' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const result = await this.appointmentsService.create(createAppointmentDto);
    return result;
  }

  @Put(':appointmentId')
  @ApiOperation({ summary: 'Reschedule an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled successfully' })
  @ApiResponse({ status: 409, description: 'New time slot is not available' })
  async reschedule(
    @Param('appointmentId') appointmentId: string,
    @Body() rescheduleAppointmentDto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.reschedule(appointmentId, rescheduleAppointmentDto);
  }

  @Delete(':appointmentId')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  async cancel(@Param('appointmentId') appointmentId: string) {
    return this.appointmentsService.cancel(appointmentId);
  }
}
