declare class DaySchedule {
    start: string;
    end: string;
}
export declare class UpdateScheduleDto {
    weeklySchedule: {
        monday?: DaySchedule;
        tuesday?: DaySchedule;
        wednesday?: DaySchedule;
        thursday?: DaySchedule;
        friday?: DaySchedule;
        saturday?: DaySchedule;
        sunday?: DaySchedule;
    };
    appointmentDuration?: number;
    timezone: string;
}
export {};
