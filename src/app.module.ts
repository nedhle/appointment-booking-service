import { Module } from '@nestjs/common';
import { ProvidersModule } from './providers/providers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ProvidersModule,
    AppointmentsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
