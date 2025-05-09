export interface DaySchedule {
    start: string;
    end: string;
}
export interface WeeklySchedule {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
}
export interface Provider {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    weeklySchedule: WeeklySchedule;
    appointmentDuration: number;
    timezone: string;
}
export interface ProviderAvailability {
    providerId: string;
    date: string;
    availableSlots: string[];
    timezone: string;
}
