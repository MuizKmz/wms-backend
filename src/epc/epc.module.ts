import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EpcController } from './epc.controller';
import { EpcService } from './epc.service';

@Module({
  controllers: [EpcController],
  providers: [EpcService, PrismaService],
})
export class EpcModule {}
