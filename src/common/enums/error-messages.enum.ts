export enum ErrorMessages {
  // Appointment related errors
  TIME_SLOT_NOT_AVAILABLE = 'Time slot is not available',
  TIME_SLOT_NO_LONGER_AVAILABLE = 'Time slot is no longer available',
  PROVIDER_NOT_FOUND = 'Provider not found',
  APPOINTMENT_NOT_FOUND = 'Appointment not found',
  CANNOT_RESCHEDULE_CANCELLED = 'Cannot reschedule a cancelled appointment',
  CANNOT_RESCHEDULE_PAST = 'Cannot reschedule a past appointment',
  CANNOT_SCHEDULE_PAST = 'Cannot schedule an appointment in the past',
  FAILED_CREATE_APPOINTMENT = 'Failed to create appointment',
  FAILED_RESCHEDULE_APPOINTMENT = 'Failed to reschedule appointment',
  FAILED_CANCEL_APPOINTMENT = 'Failed to cancel appointment',
  FAILED_FETCH_APPOINTMENT = 'Failed to fetch appointment',
  FAILED_UPDATE_APPOINTMENT = 'Failed to update appointment',

  // Provider related errors
  INVALID_START_TIME = 'Invalid start time format for',  
  INVALID_END_TIME = 'Invalid end time format for',     
  END_TIME_BEFORE_START = 'End time must be after start time for',
  EMAIL_EXISTS = 'Email already exists',
  FAILED_CREATE_PROVIDER = 'Failed to create provider',
  PROVIDER_CREATION_FAILED = 'Failed to create provider',
  FAILED_UPDATE_PROVIDER = 'Failed to update provider schedule',
  PROVIDER_SCHEDULE_CONFLICT = 'Cannot update schedule due to existing appointments',
  MISSING_START_OR_END_TIME = 'Missing start or end time',
  SCHEDULE_TIME_ORDER_ERROR = 'End time must be after start time',
  PROVIDER_SCHEDULE_UPDATE_FAILED = 'Failed to update provider schedule',
  INVALID_DAY = 'Invalid day',
  DAY_NOT_FOUND = 'Day not found',
  INVALID_TIME_FORMAT = 'Invalid time format',
  

  // Schedule related errors
  INVALID_SCHEDULE = 'Invalid schedule format',
  INVALID_DATE_FORMAT = 'Invalid date format',
  DATE_IN_PAST = 'Date cannot be in the past',
  DATE_TOO_FAR_IN_FUTURE = 'Date is too far in the future'
}
