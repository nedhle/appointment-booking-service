import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./dto/appointment-response.dto").AppointmentResponseDto>;
    reschedule(appointmentId: string, rescheduleAppointmentDto: RescheduleAppointmentDto): Promise<import("./dto/appointment-response.dto").AppointmentResponseDto>;
    cancel(appointmentId: string): Promise<import("./dto/appointment-response.dto").AppointmentResponseDto>;
}
