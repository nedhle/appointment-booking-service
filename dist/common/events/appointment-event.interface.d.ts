export declare enum AppointmentEventType {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    CANCELLED = "CANCELLED",
    RESCHEDULED = "RESCHEDULED"
}
export interface AppointmentEventPayload {
    appointmentId?: string;
    providerId?: string;
    customerId?: string;
    startTime?: Date;
    endTime?: Date;
    status?: string;
    [key: string]: any;
}
export interface AppointmentEvent {
    eventId: string;
    eventType: AppointmentEventType;
    timestamp: string;
    payload: AppointmentEventPayload;
}
