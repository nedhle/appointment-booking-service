import { Appointment, Provider } from '@prisma/client';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';
import { formatInTimeZone } from 'date-fns-tz';

export class AppointmentMapper {
  static toDto(appointment: Appointment, provider?: Provider): AppointmentResponseDto {
    const timezone = provider?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Timezone:', timezone);

    const responseDto = new AppointmentResponseDto();
    responseDto.id = appointment.id;
    responseDto.startTime = formatInTimeZone(appointment.startTime, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    responseDto.endTime = formatInTimeZone(appointment.endTime, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    responseDto.createdAt = formatInTimeZone(appointment.createdAt, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    responseDto.updatedAt = formatInTimeZone(appointment.updatedAt, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    responseDto.status = appointment.status;
    responseDto.patientId = appointment.patientId;
    responseDto.providerId = appointment.providerId;

    return responseDto;
  }
}
