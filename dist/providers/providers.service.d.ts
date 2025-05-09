import { PrismaService } from '../common/prisma.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderResponseDto, ProviderAvailabilityResponseDto } from './dto/provider-response.dto';
export declare class ProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly VALID_DAYS;
    create(createProviderDto: CreateProviderDto): Promise<ProviderResponseDto>;
    private validateTimeFormat;
    private validateDaySchedule;
    updateSchedule(providerId: string, updateScheduleDto: UpdateScheduleDto): Promise<ProviderResponseDto>;
    getAvailability(providerId: string, date: string): Promise<ProviderAvailabilityResponseDto>;
}
