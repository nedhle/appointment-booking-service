export enum AppointmentErrorMessages {
  // Creation Errors
  CREATION_FAILED = 'Failed to create appointment',
  CREATION_ERROR_PREFIX = 'Appointment Creation Error',
  PROVIDER_LOOKUP_ERROR = 'Provider lookup failed',
  
  // Cancellation Errors
  APPOINTMENT_NOT_FOUND = 'Appointment not found',
  ALREADY_CANCELLED = 'Appointment is already cancelled',
  CANNOT_CANCEL_PAST_APPOINTMENT = 'Cannot cancel a past appointment',
  
  // Rescheduling Errors
  RESCHEDULING_FAILED = 'Failed to reschedule appointment',
  RESCHEDULING_ERROR_PREFIX = 'Rescheduling Error',
  CANNOT_RESCHEDULE_CANCELLED_APPOINTMENT = 'Cannot reschedule a cancelled appointment',
  CANNOT_RESCHEDULE_PAST_APPOINTMENT = 'Cannot reschedule a past appointment',
  PROVIDER_NOT_FOUND = 'Provider not found',
  RESCHEDULING_UNKNOWN_ERROR = 'Unexpected error during rescheduling',
  
  // Availability Errors
  SLOT_NOT_AVAILABLE = 'Selected time slot is not available',
  SLOT_CONFLICT = 'Time slot is no longer available',
  NEW_SLOT_UNAVAILABLE = 'New time slot is not in provider\'s available slots',
  NEW_SLOT_CONFLICT = 'New time slot conflicts with an existing appointment',
  
  // Validation Errors
  INVALID_PROVIDER = 'Invalid provider specified',
  
  // General Errors
  UNKNOWN_ERROR = 'An unexpected error occurred'
}
