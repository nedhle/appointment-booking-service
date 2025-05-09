import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EventService } from './events/event.service';

@Module({
  providers: [PrismaService, EventService],
  exports: [PrismaService, EventService],
})
export class CommonModule {}
