export type AppointmentStatus = 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED';
export interface Appointment {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    startTime: Date;
    endTime: Date;
    status: AppointmentStatus;
    patientId: string;
    providerId: string;
}
export interface AppointmentEvent {
    eventId: string;
    eventType: 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'APPOINTMENT_RESCHEDULED';
    timestamp: string;
    payload: AppointmentEventPayload;
}
export interface AppointmentEventPayload {
    appointmentId: string;
    patientId?: string;
    providerId?: string;
    appointmentTime?: string;
    reason?: string;
    newAppointmentTime?: string;
    previousAppointmentTime?: string;
}
