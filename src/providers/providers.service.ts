import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Prisma, Appointment, AppointmentStatus } from '@prisma/client';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { WeeklySchedule, DaySchedule, ProviderAvailability } from './models/provider.model';
import { ProviderResponseDto, ProvidersListResponseDto, ProviderAvailabilityResponseDto } from './dto/provider-response.dto';
import { ErrorMessages } from '../common/enums/error-messages.enum';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  // Define valid days for type-safe access and validation
  private readonly VALID_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  async create(createProviderDto: CreateProviderDto): Promise<ProviderResponseDto> {
    try {
      // Validate weekly schedule
      const weeklySchedule = createProviderDto.weeklySchedule || {};
      
      // Check that only valid days are present
      const invalidDays = Object.keys(weeklySchedule).filter(day => 
        !this.VALID_DAYS.includes(day.toLowerCase())
      );

      if (invalidDays.length > 0) {
        throw new BadRequestException(`${ErrorMessages.INVALID_SCHEDULE}: ${invalidDays.join(', ')}`);
      }

      // Validate each day's schedule
      Object.entries(weeklySchedule).forEach(([day, daySchedule]) => {
        if (daySchedule) {
          this.validateDaySchedule(day, daySchedule);
        }
      });

      const provider = await this.prisma.provider.create({
        data: {
          weeklySchedule: weeklySchedule as Prisma.JsonObject,
          appointmentDuration: createProviderDto.appointmentDuration || 30,
          timezone: createProviderDto.timezone || 'UTC',
        },
      });
      return provider as ProviderResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(ErrorMessages.PROVIDER_CREATION_FAILED);
    }
  }

  private validateTimeFormat(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  private validateDaySchedule(day: string, daySchedule: { start?: string; end?: string; availableSlots?: string[] }): void {
    // Validate day is a valid day
    const normalizedDay = day.toLowerCase();
    if (!this.VALID_DAYS.includes(normalizedDay)) {
      throw new BadRequestException(`${ErrorMessages.DAY_NOT_FOUND}: ${day}. Must be one of: ${this.VALID_DAYS.join(', ')}`);
    }

    // Validate start and end times exist and are in correct format
    if (!daySchedule.start || !daySchedule.end) {
      throw new BadRequestException(`${ErrorMessages.MISSING_START_OR_END_TIME} for ${day}`);
    }

    // Validate time format
    if (!this.validateTimeFormat(daySchedule.start)) {
      throw new BadRequestException(`${ErrorMessages.INVALID_TIME_FORMAT} for start time in ${day}`);
    }
    if (!this.validateTimeFormat(daySchedule.end)) {
      throw new BadRequestException(`${ErrorMessages.INVALID_TIME_FORMAT} for end time in ${day}`);
    }

    // Validate start time is before end time
    const [startHour, startMin] = daySchedule.start.split(':').map(Number);
    const [endHour, endMin] = daySchedule.end.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = endHour * 60 + endMin;

    if (startTotalMinutes >= endTotalMinutes) {
      throw new BadRequestException(`${ErrorMessages.SCHEDULE_TIME_ORDER_ERROR} for ${day}`);
    }

    // Optional: Validate available slots if provided
    if (daySchedule.availableSlots) {
      daySchedule.availableSlots.forEach(slot => {
        if (!this.validateTimeFormat(slot)) {
          throw new BadRequestException(`${ErrorMessages.INVALID_TIME_FORMAT}: ${slot} for ${day}`);
        }
      });
    }
  }

  async updateSchedule(providerId: string, updateScheduleDto: UpdateScheduleDto): Promise<ProviderResponseDto> {
    // Validate new schedule before processing
    const newSchedule: Record<string, DaySchedule> = updateScheduleDto.weeklySchedule || {};

    // Validate schedule structure
    const scheduleValidationErrors: string[] = [];

    // Check that only valid days are present and validate each day's schedule
    Object.entries(newSchedule).forEach(([day, daySchedule]) => {
      const normalizedDay = day.toLowerCase();
      
      // Check day validity
      if (!this.VALID_DAYS.includes(normalizedDay)) {
        scheduleValidationErrors.push(`Invalid day: ${day}`);
        return;
      }

      // Validate day schedule
      try {
        this.validateDaySchedule(day, daySchedule);
      } catch (error) {
        if (error instanceof BadRequestException) {
          scheduleValidationErrors.push(error.message);
        }
      }
    });

    // Throw consolidated validation errors
    if (scheduleValidationErrors.length > 0) {
      throw new BadRequestException(scheduleValidationErrors.join('; '));
    }

    // Find provider with confirmed and rescheduled appointments
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
      include: { 
        appointments: {
          where: {
            OR: [
              { status: AppointmentStatus.CONFIRMED },
              { status: AppointmentStatus.RESCHEDULED }
            ],
            startTime: { gte: new Date() } // Only check future appointments
          },
          orderBy: {
            startTime: 'desc'
          }
        }
      }
    });

    if (!provider) {
      throw new NotFoundException(ErrorMessages.PROVIDER_NOT_FOUND);
    }

    // Check if there are any existing confirmed appointments
    if (provider.appointments && provider.appointments.length > 0) {
      const daysWithAppointments: string[] = [];

      // Check each appointment against the new schedule
      for (const appointment of provider.appointments) {
        // Convert appointment time to provider's local timezone
        const providerTimezone = provider.timezone || 'UTC';
        const appointmentDay = new Date(appointment.startTime).toLocaleString('en-US', { 
          timeZone: providerTimezone, 
          weekday: 'long' 
        }).toLowerCase();

        // Check if this day is being modified in the new schedule
        if (newSchedule[appointmentDay]) {
          daysWithAppointments.push(appointmentDay);
        }
      }

      // If any modified days have existing appointments, prevent update
      if (daysWithAppointments.length > 0) {
        throw new BadRequestException(
          `${ErrorMessages.PROVIDER_SCHEDULE_CONFLICT}: Existing appointments on ${daysWithAppointments.join(', ')}`
        );
      }
    }

    try {
      const updatedProvider = await this.prisma.provider.update({
        where: { id: providerId },
        data: {
          weeklySchedule: JSON.parse(JSON.stringify(newSchedule)),
          appointmentDuration: updateScheduleDto.appointmentDuration,
          timezone: updateScheduleDto.timezone,
        },
      });

      return updatedProvider as ProviderResponseDto;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.PROVIDER_NOT_FOUND);
        }
      }
      throw new BadRequestException(ErrorMessages.PROVIDER_SCHEDULE_UPDATE_FAILED);
      throw error;
    }
  }

  async getAvailability(providerId: string, date: string): Promise<ProviderAvailabilityResponseDto> {
    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException(ErrorMessages.INVALID_DATE_FORMAT);
    }

    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
      include: { appointments: true },
    });

    if (!provider) {
      throw new NotFoundException(ErrorMessages.PROVIDER_NOT_FOUND);
    }

    const weeklySchedule = (provider.weeklySchedule as Prisma.JsonObject) || {};
    const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const scheduleForDay = weeklySchedule[dayOfWeek] as { availableSlots?: string[]; start?: string; end?: string } | undefined;

    if (!scheduleForDay || !scheduleForDay.start || !scheduleForDay.end) {
      return {
        providerId: provider.id,
        date,
        availableSlots: [],
        timezone: provider.timezone
      } as ProviderAvailabilityResponseDto;
    }

    // Ensure we have default values
    const schedule = {
      availableSlots: scheduleForDay.availableSlots || [],
      start: scheduleForDay.start,
      end: scheduleForDay.end
    };

    // Convert schedule times to Date objects in provider's timezone
    const startTime = new Date(`${date}T${schedule.start}`);
    const endTime = new Date(`${date}T${schedule.end}`);

    // Validate that the date is not in the past
    const now = new Date();
    if (startTime < now) {
      if (dateObj.toDateString() === now.toDateString()) {
        // If it's today, only show future slots
        startTime.setHours(now.getHours());
        startTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
      } else {
        // If it's a past date, return no slots
        return {
          providerId: provider.id,
          date,
          availableSlots: [],
          timezone: provider.timezone
        } as ProviderAvailabilityResponseDto;
      }
    }

    // Get all non-cancelled appointments for the given date
    const conflictingAppointments = provider.appointments.filter((appointment: Appointment) => {
      const appointmentDate = appointment.startTime.toISOString().split('T')[0];
      return appointmentDate === date && appointment.status !== AppointmentStatus.CANCELLED;
    });

    // Generate time slots
    const slots: string[] = [];
    let currentSlot = startTime;

    while (currentSlot < endTime) {
      const slotEnd = new Date(
        currentSlot.getTime() + (provider.appointmentDuration || 30) * 60000
      );
      
      // Check if slot is available
      const hasConflict = conflictingAppointments.some((appointment: { startTime: Date; endTime: Date }) => {
        const appointmentStart = new Date(appointment.startTime);
        const appointmentEnd = new Date(appointment.endTime);
        const slotOverlap = currentSlot >= appointmentStart && currentSlot < appointmentEnd;
        const endOverlap = slotEnd > appointmentStart && slotEnd <= appointmentEnd;
        return slotOverlap || endOverlap;
      });

      if (!hasConflict) {
        slots.push(currentSlot.toISOString().split('T')[1].substring(0, 5));
      }

      currentSlot = slotEnd;
    }

    const availability: ProviderAvailabilityResponseDto = {
      providerId,
      date,
      availableSlots: slots,
      timezone: provider.timezone
    };
    return availability;
  }
}
