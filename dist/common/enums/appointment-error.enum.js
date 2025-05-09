"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentErrorMessages = void 0;
var AppointmentErrorMessages;
(function (AppointmentErrorMessages) {
    AppointmentErrorMessages["CREATION_FAILED"] = "Failed to create appointment";
    AppointmentErrorMessages["CREATION_ERROR_PREFIX"] = "Appointment Creation Error";
    AppointmentErrorMessages["PROVIDER_LOOKUP_ERROR"] = "Provider lookup failed";
    AppointmentErrorMessages["APPOINTMENT_NOT_FOUND"] = "Appointment not found";
    AppointmentErrorMessages["ALREADY_CANCELLED"] = "Appointment is already cancelled";
    AppointmentErrorMessages["CANNOT_CANCEL_PAST_APPOINTMENT"] = "Cannot cancel a past appointment";
    AppointmentErrorMessages["RESCHEDULING_FAILED"] = "Failed to reschedule appointment";
    AppointmentErrorMessages["RESCHEDULING_ERROR_PREFIX"] = "Rescheduling Error";
    AppointmentErrorMessages["CANNOT_RESCHEDULE_CANCELLED_APPOINTMENT"] = "Cannot reschedule a cancelled appointment";
    AppointmentErrorMessages["CANNOT_RESCHEDULE_PAST_APPOINTMENT"] = "Cannot reschedule a past appointment";
    AppointmentErrorMessages["PROVIDER_NOT_FOUND"] = "Provider not found";
    AppointmentErrorMessages["RESCHEDULING_UNKNOWN_ERROR"] = "Unexpected error during rescheduling";
    AppointmentErrorMessages["SLOT_NOT_AVAILABLE"] = "Selected time slot is not available";
    AppointmentErrorMessages["SLOT_CONFLICT"] = "Time slot is no longer available";
    AppointmentErrorMessages["NEW_SLOT_UNAVAILABLE"] = "New time slot is not in provider's available slots";
    AppointmentErrorMessages["NEW_SLOT_CONFLICT"] = "New time slot conflicts with an existing appointment";
    AppointmentErrorMessages["INVALID_PROVIDER"] = "Invalid provider specified";
    AppointmentErrorMessages["UNKNOWN_ERROR"] = "An unexpected error occurred";
})(AppointmentErrorMessages || (exports.AppointmentErrorMessages = AppointmentErrorMessages = {}));
//# sourceMappingURL=appointment-error.enum.js.map