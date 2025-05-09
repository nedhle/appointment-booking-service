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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const providers_service_1 = require("../providers/providers.service");
const date_fns_tz_1 = require("date-fns-tz");
const appointment_mapper_1 = require("./mappers/appointment.mapper");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, providersService) {
        this.prisma = prisma;
        this.providersService = providersService;
    }
    async checkAvailability(providerId, utcStartTime) {
        const provider = await this.prisma.provider.findUnique({
            where: { id: providerId },
        });
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        const localTime = (0, date_fns_tz_1.toZonedTime)(utcStartTime, provider.timezone);
        const date = localTime.toISOString().split('T')[0];
        const timeSlot = `${localTime.getHours().toString().padStart(2, '0')}:${localTime.getMinutes().toString().padStart(2, '0')}`;
        const availability = await this.providersService.getAvailability(providerId, date);
        console.log('Availability for provider:', providerId, 'on date:', date, 'is:', availability);
        return availability.availableSlots.includes(timeSlot);
    }
    async create(createAppointmentDto) {
        console.log('Create Appointment DTO:', createAppointmentDto);
        const provider = await this.prisma.provider.findUnique({
            where: { id: createAppointmentDto.providerId },
        });
        if (!provider) {
            console.error('Provider not found:', createAppointmentDto.providerId);
            throw new common_1.NotFoundException('Provider not found');
        }
        const utcStartTime = new Date(createAppointmentDto.startTime);
        console.log('UTC Start Time:', utcStartTime);
        const isAvailable = await this.checkAvailability(createAppointmentDto.providerId, utcStartTime);
        if (!isAvailable) {
            console.error('Time slot is not available');
            throw new common_1.ConflictException('Time slot is not available');
        }
        const utcEndTime = new Date(utcStartTime.getTime() + provider.appointmentDuration * 60000);
        console.log('UTC End Time:', utcEndTime);
        try {
            const appointment = await this.prisma.$transaction(async (prisma) => {
                const conflicting = await prisma.appointment.findFirst({
                    where: {
                        providerId: createAppointmentDto.providerId,
                        status: 'CONFIRMED',
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
                    console.error('Time slot is no longer available');
                    throw new common_1.ConflictException('Time slot is no longer available');
                }
                const newAppointment = await prisma.appointment.create({
                    data: {
                        startTime: utcStartTime,
                        endTime: utcEndTime,
                        status: 'CONFIRMED',
                        patientId: createAppointmentDto.patientId,
                        providerId: createAppointmentDto.providerId,
                    },
                });
                console.log('New Appointment:', newAppointment);
                const mappedAppointment = appointment_mapper_1.AppointmentMapper.toDto(newAppointment, provider);
                console.log('Mapped Appointment:', mappedAppointment);
                await this.emitEvent('APPOINTMENT_CONFIRMED', {
                    appointmentId: mappedAppointment.id,
                    patientId: mappedAppointment.patientId,
                    providerId: mappedAppointment.providerId,
                    appointmentTime: mappedAppointment.startTime,
                });
                return mappedAppointment;
            });
            return appointment;
        }
        catch (error) {
            console.error('Appointment Creation Error:', error);
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.ConflictException('Failed to create appointment');
        }
    }
    async cancel(appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.ConflictException('Appointment is already cancelled');
        }
        if (appointment.startTime < new Date()) {
            throw new common_1.ConflictException('Cannot cancel a past appointment');
        }
        const provider = await this.prisma.provider.findUnique({
            where: { id: appointment.providerId },
        });
        const updatedAppointment = await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' },
        });
        await this.emitEvent('APPOINTMENT_CANCELLED', {
            appointmentId: updatedAppointment.id,
            patientId: updatedAppointment.patientId,
            providerId: updatedAppointment.providerId,
            appointmentTime: new Date(updatedAppointment.startTime).toISOString(),
        });
        return appointment_mapper_1.AppointmentMapper.toDto(updatedAppointment, provider || undefined);
    }
    async reschedule(appointmentId, rescheduleDto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.ConflictException('Cannot reschedule a cancelled appointment');
        }
        if (appointment.startTime < new Date()) {
            throw new common_1.ConflictException('Cannot reschedule a past appointment');
        }
        const provider = await this.prisma.provider.findUnique({
            where: { id: appointment.providerId },
        });
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found');
        }
        const utcNewStartTime = new Date(rescheduleDto.startTime);
        const utcNewEndTime = new Date(utcNewStartTime.getTime() + provider.appointmentDuration * 60000);
        if (utcNewStartTime < new Date()) {
            throw new common_1.ConflictException('Cannot schedule an appointment in the past');
        }
        try {
            const updatedAppointment = await this.prisma.$transaction(async (prisma) => {
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
                    throw new common_1.ConflictException('New time slot conflicts with an existing appointment');
                }
                const localTime = (0, date_fns_tz_1.toZonedTime)(utcNewStartTime, provider.timezone);
                const date = localTime.toISOString().split('T')[0];
                const timeSlot = `${localTime.getHours().toString().padStart(2, '0')}:${localTime.getMinutes().toString().padStart(2, '0')}`;
                const availability = await this.providersService.getAvailability(provider.id, date);
                if (!availability.availableSlots.includes(timeSlot)) {
                    throw new common_1.ConflictException('New time slot is not in provider\'s available slots');
                }
                return await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        startTime: utcNewStartTime,
                        endTime: utcNewEndTime,
                        status: 'RESCHEDULED',
                    },
                });
            });
            const mappedAppointment = appointment_mapper_1.AppointmentMapper.toDto(updatedAppointment, provider);
            await this.emitEvent('APPOINTMENT_RESCHEDULED', {
                appointmentId: mappedAppointment.id,
                patientId: mappedAppointment.patientId,
                providerId: mappedAppointment.providerId,
                previousAppointmentTime: new Date(appointment.startTime).toISOString(),
            });
            return mappedAppointment;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.ConflictException('Failed to reschedule appointment');
        }
    }
    async emitEvent(eventType, payload) {
        const event = {
            eventId: `evt_${Date.now()}`,
            eventType,
            timestamp: new Date().toISOString(),
            payload,
        };
        console.log('Event emitted:', event);
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        providers_service_1.ProvidersService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map