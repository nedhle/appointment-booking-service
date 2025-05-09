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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const appointments_service_1 = require("./appointments.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const reschedule_appointment_dto_1 = require("./dto/reschedule-appointment.dto");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async create(createAppointmentDto) {
        const result = await this.appointmentsService.create(createAppointmentDto);
        return result;
    }
    async reschedule(appointmentId, rescheduleAppointmentDto) {
        return this.appointmentsService.reschedule(appointmentId, rescheduleAppointmentDto);
    }
    async cancel(appointmentId) {
        return this.appointmentsService.cancel(appointmentId);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Time slot is not available' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':appointmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Reschedule an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment rescheduled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'New time slot is not available' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_appointment_dto_1.RescheduleAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "reschedule", null);
__decorate([
    (0, common_1.Delete)(':appointmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "cancel", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('appointments'),
    (0, common_1.Controller)('api/appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map