"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["TIME_SLOT_NOT_AVAILABLE"] = "Time slot is not available";
    ErrorMessages["TIME_SLOT_NO_LONGER_AVAILABLE"] = "Time slot is no longer available";
    ErrorMessages["PROVIDER_NOT_FOUND"] = "Provider not found";
    ErrorMessages["APPOINTMENT_NOT_FOUND"] = "Appointment not found";
    ErrorMessages["CANNOT_RESCHEDULE_CANCELLED"] = "Cannot reschedule a cancelled appointment";
    ErrorMessages["CANNOT_RESCHEDULE_PAST"] = "Cannot reschedule a past appointment";
    ErrorMessages["CANNOT_SCHEDULE_PAST"] = "Cannot schedule an appointment in the past";
    ErrorMessages["FAILED_CREATE_APPOINTMENT"] = "Failed to create appointment";
    ErrorMessages["FAILED_RESCHEDULE_APPOINTMENT"] = "Failed to reschedule appointment";
    ErrorMessages["FAILED_CANCEL_APPOINTMENT"] = "Failed to cancel appointment";
    ErrorMessages["FAILED_FETCH_APPOINTMENT"] = "Failed to fetch appointment";
    ErrorMessages["FAILED_UPDATE_APPOINTMENT"] = "Failed to update appointment";
    ErrorMessages["INVALID_START_TIME"] = "Invalid start time format for";
    ErrorMessages["INVALID_END_TIME"] = "Invalid end time format for";
    ErrorMessages["END_TIME_BEFORE_START"] = "End time must be after start time for";
    ErrorMessages["EMAIL_EXISTS"] = "Email already exists";
    ErrorMessages["FAILED_CREATE_PROVIDER"] = "Failed to create provider";
    ErrorMessages["FAILED_UPDATE_PROVIDER"] = "Failed to update provider";
    ErrorMessages["INVALID_SCHEDULE"] = "Invalid schedule format";
    ErrorMessages["INVALID_DATE_FORMAT"] = "Invalid date format";
    ErrorMessages["DATE_IN_PAST"] = "Date cannot be in the past";
    ErrorMessages["DATE_TOO_FAR_IN_FUTURE"] = "Date is too far in the future";
})(ErrorMessages || (exports.ErrorMessages = ErrorMessages = {}));
//# sourceMappingURL=error-messages.enum.js.map