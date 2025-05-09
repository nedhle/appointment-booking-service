"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const providers_service_1 = require("./providers.service");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
const create_provider_dto_1 = require("./dto/create-provider.dto");
const provider_response_dto_1 = require("./dto/provider-response.dto");
let ProvidersController = class ProvidersController {
    constructor(providersService) {
        this.providersService = providersService;
    }
    async createProvider(createProviderDto) {
        const provider = await this.providersService.create(createProviderDto);
        return {
            ...provider,
            weeklySchedule: provider.weeklySchedule
        };
    }
    async updateSchedule(providerId, updateScheduleDto) {
        const provider = await this.providersService.updateSchedule(providerId, updateScheduleDto);
        return {
            ...provider,
            weeklySchedule: provider.weeklySchedule
        };
    }
    async getAvailability(providerId, date) {
        const availability = await this.providersService.getAvailability(providerId, date);
        return {
            providerId: availability.providerId,
            date: availability.date,
            availableSlots: availability.availableSlots,
            timezone: 'UTC'
        };
    }
};
exports.ProvidersController = ProvidersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new provider' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: provider_response_dto_1.ProviderResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_provider_dto_1.CreateProviderDto]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "createProvider", null);
__decorate([
    (0, common_1.Put)(':providerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update provider schedule' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: provider_response_dto_1.ProviderResponseDto }),
    __param(0, (0, common_1.Param)('providerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Get)(':providerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get provider availability for a specific date' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: provider_response_dto_1.ProviderAvailabilityResponseDto }),
    __param(0, (0, common_1.Param)('providerId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProvidersController.prototype, "getAvailability", null);
exports.ProvidersController = ProvidersController = __decorate([
    (0, swagger_1.ApiTags)('providers'),
    (0, common_1.Controller)('api/providers'),
    __metadata("design:paramtypes", [providers_service_1.ProvidersService])
], ProvidersController);
//# sourceMappingURL=providers.controller.js.map