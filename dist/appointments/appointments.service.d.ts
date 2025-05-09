import { PrismaService } from '../common/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { ProvidersService } from '../providers/providers.service';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
export declare class AppointmentsService {
    private prisma;
    private providersService;
    constructor(prisma: PrismaService, providersService: ProvidersService);
    private checkAvailability;
    create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentResponseDto>;
    cancel(appointmentId: string): Promise<AppointmentResponseDto>;
    reschedule(appointmentId: string, rescheduleDto: RescheduleAppointmentDto): Promise<AppointmentResponseDto>;
    private emitEvent;
}
