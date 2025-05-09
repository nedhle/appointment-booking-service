"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
const error_messages_enum_1 = require("../common/enums/error-messages.enum");
let ProvidersService = class ProvidersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.VALID_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    }
    async create(createProviderDto) {
        try {
            const weeklySchedule = createProviderDto.weeklySchedule || {};
            const invalidDays = Object.keys(weeklySchedule).filter(day => !this.VALID_DAYS.includes(day.toLowerCase()));
            if (invalidDays.length > 0) {
                throw new common_1.BadRequestException(`Invalid days in schedule: ${invalidDays.join(', ')}`);
            }
            Object.entries(weeklySchedule).forEach(([day, daySchedule]) => {
                if (daySchedule) {
                    this.validateDaySchedule(day, daySchedule);
                }
            });
            const provider = await this.prisma.provider.create({
                data: {
                    weeklySchedule: weeklySchedule,
                    appointmentDuration: createProviderDto.appointmentDuration || 30,
                    timezone: createProviderDto.timezone || 'UTC',
                },
            });
            return provider;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Failed to create provider');
        }
    }
    validateTimeFormat(time) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(time);
    }
    validateDaySchedule(day, daySchedule) {
        const normalizedDay = day.toLowerCase();
        if (!this.VALID_DAYS.includes(normalizedDay)) {
            throw new common_1.BadRequestException(`Invalid day: ${day}. Must be one of: ${this.VALID_DAYS.join(', ')}`);
        }
        if (!daySchedule.start || !daySchedule.end) {
            throw new common_1.BadRequestException(`Missing start or end time for ${day}`);
        }
        if (!this.validateTimeFormat(daySchedule.start)) {
            throw new common_1.BadRequestException(`Invalid start time format for ${day}. Use HH:MM format`);
        }
        if (!this.validateTimeFormat(daySchedule.end)) {
            throw new common_1.BadRequestException(`Invalid end time format for ${day}. Use HH:MM format`);
        }
        const [startHour, startMin] = daySchedule.start.split(':').map(Number);
        const [endHour, endMin] = daySchedule.end.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMin;
        const endTotalMinutes = endHour * 60 + endMin;
        if (startTotalMinutes >= endTotalMinutes) {
            throw new common_1.BadRequestException(`End time must be after start time for ${day}`);
        }
        if (daySchedule.availableSlots) {
            daySchedule.availableSlots.forEach(slot => {
                if (!this.validateTimeFormat(slot)) {
                    throw new common_1.BadRequestException(`Invalid slot time: ${slot} for ${day}`);
                }
            });
        }
    }
    async updateSchedule(providerId, updateScheduleDto) {
        const newSchedule = updateScheduleDto.weeklySchedule || {};
        const scheduleValidationErrors = [];
        Object.entries(newSchedule).forEach(([day, daySchedule]) => {
            const normalizedDay = day.toLowerCase();
            if (!this.VALID_DAYS.includes(normalizedDay)) {
                scheduleValidationErrors.push(`Invalid day: ${day}`);
                return;
            }
            try {
                this.validateDaySchedule(day, daySchedule);
            }
            catch (error) {
                if (error instanceof common_1.BadRequestException) {
                    scheduleValidationErrors.push(error.message);
                }
            }
        });
        if (scheduleValidationErrors.length > 0) {
            throw new common_1.BadRequestException(scheduleValidationErrors.join('; '));
        }
        const provider = await this.prisma.provider.findUnique({
            where: { id: providerId },
            include: {
                appointments: {
                    where: {
                        OR: [
                            { status: 'CONFIRMED' },
                            { status: 'RESCHEDULED' }
                        ],
                        startTime: { gte: new Date() }
                    },
                    orderBy: {
                        startTime: 'desc'
                    }
                }
            }
        });
        if (!provider) {
            throw new common_1.NotFoundException(error_messages_enum_1.ErrorMessages.PROVIDER_NOT_FOUND);
        }
        if (provider.appointments && provider.appointments.length > 0) {
            const daysWithAppointments = [];
            for (const appointment of provider.appointments) {
                const providerTimezone = provider.timezone || 'UTC';
                const appointmentDay = new Date(appointment.startTime).toLocaleString('en-US', {
                    timeZone: providerTimezone,
                    weekday: 'long'
                }).toLowerCase();
                if (newSchedule[appointmentDay]) {
                    daysWithAppointments.push(appointmentDay);
                }
            }
            if (daysWithAppointments.length > 0) {
                throw new common_1.BadRequestException(`Cannot update schedule. Existing appointments on: ${daysWithAppointments.join(', ')}`);
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
            return updatedProvider;
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(error_messages_enum_1.ErrorMessages.PROVIDER_NOT_FOUND);
                }
            }
            throw error;
        }
    }
    async getAvailability(providerId, date) {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new common_1.BadRequestException(error_messages_enum_1.ErrorMessages.INVALID_DATE_FORMAT);
        }
        const provider = await this.prisma.provider.findUnique({
            where: { id: providerId },
            include: { appointments: true },
        });
        if (!provider) {
            throw new common_1.NotFoundException(error_messages_enum_1.ErrorMessages.PROVIDER_NOT_FOUND);
        }
        const weeklySchedule = provider.weeklySchedule || {};
        const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        const scheduleForDay = weeklySchedule[dayOfWeek];
        if (!scheduleForDay || !scheduleForDay.start || !scheduleForDay.end) {
            return {
                providerId: provider.id,
                date,
                availableSlots: [],
                timezone: provider.timezone
            };
        }
        const schedule = {
            availableSlots: scheduleForDay.availableSlots || [],
            start: scheduleForDay.start,
            end: scheduleForDay.end
        };
        const startTime = new Date(`${date}T${schedule.start}`);
        const endTime = new Date(`${date}T${schedule.end}`);
        const now = new Date();
        if (startTime < now) {
            if (dateObj.toDateString() === now.toDateString()) {
                startTime.setHours(now.getHours());
                startTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
            }
            else {
                return {
                    providerId: provider.id,
                    date,
                    availableSlots: [],
                    timezone: provider.timezone
                };
            }
        }
        const conflictingAppointments = provider.appointments.filter((appointment) => {
            const appointmentDate = appointment.startTime.toISOString().split('T')[0];
            return appointmentDate === date && appointment.status !== 'CANCELLED';
        });
        const slots = [];
        let currentSlot = startTime;
        while (currentSlot < endTime) {
            const slotEnd = new Date(currentSlot.getTime() + (provider.appointmentDuration || 30) * 60000);
            const hasConflict = conflictingAppointments.some((appointment) => {
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
        const availability = {
            providerId,
            date,
            availableSlots: slots,
            timezone: provider.timezone
        };
        return availability;
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map