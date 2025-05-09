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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderAvailabilityResponseDto = exports.ProvidersListResponseDto = exports.ProviderResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProviderResponseDto {
}
exports.ProviderResponseDto = ProviderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider data' }),
    __metadata("design:type", String)
], ProviderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider weekly schedule' }),
    __metadata("design:type", Object)
], ProviderResponseDto.prototype, "weeklySchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration of appointments in minutes' }),
    __metadata("design:type", Number)
], ProviderResponseDto.prototype, "appointmentDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider timezone' }),
    __metadata("design:type", String)
], ProviderResponseDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    __metadata("design:type", Date)
], ProviderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    __metadata("design:type", Date)
], ProviderResponseDto.prototype, "updatedAt", void 0);
class ProvidersListResponseDto {
}
exports.ProvidersListResponseDto = ProvidersListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of providers', type: [ProviderResponseDto] }),
    __metadata("design:type", Array)
], ProvidersListResponseDto.prototype, "providers", void 0);
class ProviderAvailabilityResponseDto {
}
exports.ProviderAvailabilityResponseDto = ProviderAvailabilityResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider ID' }),
    __metadata("design:type", String)
], ProviderAvailabilityResponseDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date for availability check' }),
    __metadata("design:type", String)
], ProviderAvailabilityResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of available time slots' }),
    __metadata("design:type", Array)
], ProviderAvailabilityResponseDto.prototype, "availableSlots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Provider timezone' }),
    __metadata("design:type", String)
], ProviderAvailabilityResponseDto.prototype, "timezone", void 0);
//# sourceMappingURL=provider-response.dto.js.map