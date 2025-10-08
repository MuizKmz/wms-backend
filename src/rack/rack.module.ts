import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RackService } from './rack.service';
import { RackController } from './rack.controller';

@Module({
  controllers: [RackController],
  providers: [RackService, PrismaService],
})
export class RackModule {}
