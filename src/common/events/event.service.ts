import { Injectable } from '@nestjs/common';
import { AppointmentEvent, AppointmentEventType, AppointmentEventPayload } from './appointment-event.interface';

@Injectable()
export class EventService {
  async emitEvent(eventType: AppointmentEventType, payload: AppointmentEventPayload): Promise<void> {
    // This is a mock implementation of the event emission
    const event: AppointmentEvent = {
      eventId: `evt_${Date.now()}`,
      eventType,
      timestamp: new Date().toISOString(),
      payload,
    };
    console.log('Event emitted:', event);
    
    // In a real-world scenario, this would integrate with an event bus or message queue
    // For example:
    // await this.eventBus.publish(event);
  }
}
