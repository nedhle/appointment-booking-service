import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ProvidersModule } from '../providers/providers.module';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [ProvidersModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService],
})
export class AppointmentsModule {}
