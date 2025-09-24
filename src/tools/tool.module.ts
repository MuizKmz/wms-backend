import { Module } from '@nestjs/common';
import {  ToolService } from './tool.service';
import { PrismaService } from '../prisma.service';
import { ToolController } from './tool.controller';

@Module({
  controllers: [ToolController],
  providers: [ToolService, PrismaService],
})
export class ToolModule {}
