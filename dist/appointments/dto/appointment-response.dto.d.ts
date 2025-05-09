import { AppointmentStatus } from '@prisma/client';
export declare class AppointmentResponseDto {
    id: string;
    createdAt: string;
    updatedAt: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    patientId: string;
    providerId: string;
}
export declare class AppointmentsListResponseDto {
    appointments: AppointmentResponseDto[];
}
