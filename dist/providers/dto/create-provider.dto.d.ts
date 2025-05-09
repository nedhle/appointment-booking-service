import { WeeklySchedule } from '../models/provider.model';
export declare class CreateProviderDto {
    weeklySchedule?: WeeklySchedule;
    appointmentDuration?: number;
    timezone?: string;
}
