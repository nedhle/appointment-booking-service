import { WeeklySchedule } from '../models/provider.model';
export declare class ProviderResponseDto {
    id: string;
    weeklySchedule: WeeklySchedule;
    appointmentDuration: number;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ProvidersListResponseDto {
    providers: ProviderResponseDto[];
}
export declare class ProviderAvailabilityResponseDto {
    providerId: string;
    date: string;
    availableSlots: string[];
    timezone: string;
}
