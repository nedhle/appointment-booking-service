import { AppointmentEventType, AppointmentEventPayload } from './appointment-event.interface';
export declare class EventService {
    emitEvent(eventType: AppointmentEventType, payload: AppointmentEventPayload): Promise<void>;
}
