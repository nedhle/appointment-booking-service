import { Controller, Get, Put, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProviderResponseDto, ProvidersListResponseDto, ProviderAvailabilityResponseDto } from './dto/provider-response.dto';

@ApiTags('providers')
@Controller('api/providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new provider' })
  @ApiResponse({ status: 201, type: ProviderResponseDto })
  async createProvider(@Body() createProviderDto: CreateProviderDto): Promise<ProviderResponseDto> {
    const provider = await this.providersService.create(createProviderDto);
    return {
      ...provider,
      weeklySchedule: provider.weeklySchedule
    } as ProviderResponseDto;
  }

  @Put(':providerId')
  @ApiOperation({ summary: 'Update provider schedule' })
  @ApiResponse({ status: 200, type: ProviderResponseDto })
  async updateSchedule(
    @Param('providerId') providerId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ): Promise<ProviderResponseDto> {
    const provider = await this.providersService.updateSchedule(providerId, updateScheduleDto);
    return {
      ...provider,
      weeklySchedule: provider.weeklySchedule
    } as ProviderResponseDto;
  }

  @Get(':providerId')
  @ApiOperation({ summary: 'Get provider availability for a specific date' })
  @ApiResponse({ status: 200, type: ProviderAvailabilityResponseDto })
  async getAvailability(
    @Param('providerId') providerId: string,
    @Query('date') date: string,
  ): Promise<ProviderAvailabilityResponseDto> {
    const availability = await this.providersService.getAvailability(providerId, date);
    return {
      providerId: availability.providerId,
      date: availability.date,
      availableSlots: availability.availableSlots,
      timezone: 'UTC'
    } as ProviderAvailabilityResponseDto;
  }
}
