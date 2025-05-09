import { Appointment, Provider } from '@prisma/client';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';
export declare class AppointmentMapper {
    static toDto(appointment: Appointment, provider?: Provider): AppointmentResponseDto;
}
