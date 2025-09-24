import { Module } from '@nestjs/common';
import { MouldService} from './mould.service';
import { PrismaService } from '../prisma.service';
import { MouldController } from './mould.controller';

@Module({
  controllers: [MouldController],
  providers: [MouldService, PrismaService],
})
export class MouldModule {}
