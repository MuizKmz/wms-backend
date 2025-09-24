import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { PrismaService } from '../prisma.service';
import { MachineController } from './machine.controller';

@Module({
  controllers: [MachineController],
  providers: [MachineService, PrismaService],
})
export class MachineModule {}
