import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';

@Module({
  controllers: [SectionController],
  providers: [SectionService, PrismaService],
})
export class SectionModule {}
