"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentMapper = void 0;
const appointment_response_dto_1 = require("../dto/appointment-response.dto");
const date_fns_tz_1 = require("date-fns-tz");
class AppointmentMapper {
    static toDto(appointment, provider) {
        const timezone = provider?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('Timezone:', timezone);
        const responseDto = new appointment_response_dto_1.AppointmentResponseDto();
        responseDto.id = appointment.id;
        responseDto.startTime = (0, date_fns_tz_1.formatInTimeZone)(appointment.startTime, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        responseDto.endTime = (0, date_fns_tz_1.formatInTimeZone)(appointment.endTime, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        responseDto.createdAt = (0, date_fns_tz_1.formatInTimeZone)(appointment.createdAt, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        responseDto.updatedAt = (0, date_fns_tz_1.formatInTimeZone)(appointment.updatedAt, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
        responseDto.status = appointment.status;
        responseDto.patientId = appointment.patientId;
        responseDto.providerId = appointment.providerId;
        return responseDto;
    }
}
exports.AppointmentMapper = AppointmentMapper;
//# sourceMappingURL=appointment.mapper.js.map