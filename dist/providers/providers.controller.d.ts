import { ProvidersService } from './providers.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderResponseDto, ProviderAvailabilityResponseDto } from './dto/provider-response.dto';
export declare class ProvidersController {
    private readonly providersService;
    constructor(providersService: ProvidersService);
    createProvider(createProviderDto: CreateProviderDto): Promise<ProviderResponseDto>;
    updateSchedule(providerId: string, updateScheduleDto: UpdateScheduleDto): Promise<ProviderResponseDto>;
    getAvailability(providerId: string, date: string): Promise<ProviderAvailabilityResponseDto>;
}
