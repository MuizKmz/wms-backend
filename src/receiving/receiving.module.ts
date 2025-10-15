import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ReceivingController } from './receiving.controller';
import { ReceivingService } from './receiving.service';

@Module({
  controllers: [ReceivingController],
  providers: [ReceivingService, PrismaService],
})
export class ReceivingModule {}
