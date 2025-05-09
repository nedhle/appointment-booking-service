import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ProvidersService } from '../providers/providers.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { EventService } from '../common/events/event.service';
import { AppointmentEventType } from '../common/events/appointment-event.interface';
import { AppointmentMapper } from './mappers/appointment.mapper';
import { AppointmentEventPayload } from './models/appointment.model';
import { AppointmentErrorMessages } from '../common/enums/appointment-error.enum';
import { AppointmentStatus } from '@prisma/client';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private providersService: ProvidersService,
    private eventService: EventService,
  ) {}

  private async checkAvailability(providerId: string, utcStartTime: Date): Promise<boolean> {
    // Get provider to use their timezone
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new NotFoundException(AppointmentErrorMessages.INVALID_PROVIDER);
    }

    // Convert UTC time to provider's local time
    const localTime = toZonedTime(utcStartTime, provider.timezone);
    const date = localTime.toISOString().split('T')[0];
    const timeSlot = `${localTime.getHours().toString().padStart(2, '0')}:${localTime.getMinutes().toString().padStart(2, '0')}`;
    
    const availability = await this.providersService.getAvailability(providerId, date);
    return availability.availableSlots.includes(timeSlot as never);
  }

  async create(createAppointmentDto: CreateAppointmentDto) {

    // Get provider first to use their timezone
    const provider = await this.prisma.provider.findUnique({
      where: { id: createAppointmentDto.providerId },
    });

    if (!provider) {
      console.error(AppointmentErrorMessages.PROVIDER_LOOKUP_ERROR, createAppointmentDto.providerId);
      throw new NotFoundException(AppointmentErrorMessages.INVALID_PROVIDER);
    }

    // Convert input time to UTC
    const utcStartTime = new Date(createAppointmentDto.startTime);
    
    // Check if the slot is available
    const isAvailable = await this.checkAvailability(
      createAppointmentDto.providerId,
      utcStartTime,
    );

    if (!isAvailable) {
      console.error(AppointmentErrorMessages.SLOT_NOT_AVAILABLE);
      throw new ConflictException(AppointmentErrorMessages.SLOT_NOT_AVAILABLE);
    }

    // Calculate end time in UTC
    const utcEndTime = new Date(utcStartTime.getTime() + provider.appointmentDuration * 60000);

    // Create appointment with optimistic locking
    try {
      const appointment = await this.prisma.$transaction(async (prisma: PrismaService) => {
        // Check for conflicting appointments one last time
        const conflicting = await prisma.appointment.findFirst({
          where: {
            providerId: createAppointmentDto.providerId,
            status: AppointmentStatus.CONFIRMED,
            OR: [
              {
                AND: [
                  { startTime: { lte: utcStartTime } },
                  { endTime: { gt: utcStartTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: utcEndTime } },
                  { endTime: { gte: utcEndTime } },
                ],
              },
            ],
          },
        });

        if (conflicting) {
          console.error(AppointmentErrorMessages.SLOT_CONFLICT);
          throw new ConflictException(AppointmentErrorMessages.SLOT_CONFLICT);
        }

        const newAppointment = await prisma.appointment.create({
          data: {
            startTime: utcStartTime,
            endTime: utcEndTime,
            status: AppointmentStatus.CONFIRMED,
            patientId: createAppointmentDto.patientId,
            providerId: createAppointmentDto.providerId,
          },
        });

        const mappedAppointment = AppointmentMapper.toDto(newAppointment, provider);

        // Emit event (mocked)
        await this.emitEvent(AppointmentEventType.CREATED, {
          appointmentId: mappedAppointment.id,
          patientId: mappedAppointment.patientId,
          providerId: mappedAppointment.providerId,
          appointmentTime: mappedAppointment.startTime,
        });

        return mappedAppointment;
      });

      return appointment;
    } catch (error) {
      console.error(AppointmentErrorMessages.CREATION_ERROR_PREFIX, error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(AppointmentErrorMessages.CREATION_FAILED);
    }
  }

  async cancel(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(AppointmentErrorMessages.APPOINTMENT_NOT_FOUND);
    }

    // Check if the appointment is already cancelled
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new ConflictException(AppointmentErrorMessages.ALREADY_CANCELLED);
    }

    // Check if the appointment has already passed
    if (appointment.startTime < new Date()) {
      throw new ConflictException(AppointmentErrorMessages.CANNOT_CANCEL_PAST_APPOINTMENT);
    }

    // Get provider to use their timezone for mapping
    const provider = await this.prisma.provider.findUnique({
      where: { id: appointment.providerId },
    });

    // Update appointment status to CANCELLED
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });

    // Emit event (mocked)
    await this.emitEvent(AppointmentEventType.CANCELLED, {
      appointmentId: updatedAppointment.id,
      patientId: updatedAppointment.patientId,
      providerId: updatedAppointment.providerId,
      appointmentTime: new Date(updatedAppointment.startTime).toISOString(),
    });

    // Return the mapped appointment, using local timezone if provider not found
    return AppointmentMapper.toDto(updatedAppointment, provider || undefined);
  }

  async reschedule(appointmentId: string, rescheduleDto: RescheduleAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException(AppointmentErrorMessages.APPOINTMENT_NOT_FOUND);
    }

    // Verify appointment is in a modifiable state
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new ConflictException(AppointmentErrorMessages.CANNOT_RESCHEDULE_CANCELLED_APPOINTMENT);
    }

    // Verify the appointment hasn't already passed
    if (appointment.startTime < new Date()) {
      throw new ConflictException(AppointmentErrorMessages.CANNOT_RESCHEDULE_PAST_APPOINTMENT);
    }

    const provider = await this.prisma.provider.findUnique({
      where: { id: appointment.providerId },
    });

    if (!provider) {
      throw new NotFoundException(AppointmentErrorMessages.PROVIDER_NOT_FOUND);
    }

    // Convert input time to UTC
    const utcNewStartTime = new Date(rescheduleDto.startTime);
    
    // Calculate end time in UTC
    const utcNewEndTime = new Date(utcNewStartTime.getTime() + provider.appointmentDuration * 60000);
    
    // Validate the new start time is in the future
    if (utcNewStartTime < new Date()) {
      throw new ConflictException('Cannot schedule an appointment in the past');
    }

    try {
      const updatedAppointment = await this.prisma.$transaction(async (prisma: PrismaService) => {
        // Check for conflicts with other confirmed appointments
        const conflicting = await prisma.appointment.findFirst({
          where: {
            providerId: appointment.providerId,
            status: 'CONFIRMED',
            id: { not: appointmentId },
            OR: [
              {
                AND: [
                  { startTime: { lte: utcNewStartTime } },
                  { endTime: { gt: utcNewStartTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: utcNewEndTime } },
                  { endTime: { gte: utcNewEndTime } },
                ],
              },
              {
                AND: [
                  { startTime: { gte: utcNewStartTime } },
                  { startTime: { lt: utcNewEndTime } },
                ],
              },
            ],
          },
        });

        if (conflicting) {
          throw new ConflictException(AppointmentErrorMessages.NEW_SLOT_CONFLICT);
        }

        // Check provider availability
        const localTime = toZonedTime(utcNewStartTime, provider.timezone);
        const date = localTime.toISOString().split('T')[0];
        const timeSlot = `${localTime.getHours().toString().padStart(2, '0')}:${localTime.getMinutes().toString().padStart(2, '0')}`;
        
        const availability = await this.providersService.getAvailability(provider.id, date);
        if (!availability.availableSlots.includes(timeSlot as never)) {
          throw new ConflictException(AppointmentErrorMessages.NEW_SLOT_UNAVAILABLE);
        }

        return await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            startTime: utcNewStartTime,
            endTime: utcNewEndTime,
            status: AppointmentStatus.RESCHEDULED,
          },
        });
      });

      const mappedAppointment = AppointmentMapper.toDto(updatedAppointment, provider);

      // Emit event (mocked)
      await this.emitEvent(AppointmentEventType.RESCHEDULED, {
        appointmentId: mappedAppointment.id,
        patientId: mappedAppointment.patientId,
        providerId: mappedAppointment.providerId,
        previousAppointmentTime: new Date(appointment.startTime).toISOString(),
      });

      return mappedAppointment;
    } catch (error) {
      console.error(AppointmentErrorMessages.RESCHEDULING_ERROR_PREFIX, error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(AppointmentErrorMessages.RESCHEDULING_UNKNOWN_ERROR);
    }
  }

  // Event emission now handled by EventService
  private async emitEvent(eventType: AppointmentEventType, payload: AppointmentEventPayload): Promise<void> {
    await this.eventService.emitEvent(eventType, payload);
  }
}
