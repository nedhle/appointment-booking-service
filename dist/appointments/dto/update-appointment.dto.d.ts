import { AppointmentStatus } from '@prisma/client';
export declare class UpdateAppointmentDto {
    startTime?: Date;
    endTime?: Date;
    patientId?: string;
    providerId?: string;
    status?: AppointmentStatus;
}
