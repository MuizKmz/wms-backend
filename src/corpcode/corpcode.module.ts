import { Module } from '@nestjs/common';
import { CorpCodeController } from './corpcode.controller';
import { CorpCodeService } from './corpcode.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CorpCodeController],
  providers: [CorpCodeService, PrismaService],
  exports: [CorpCodeService], // Export so other modules can use it
})
export class CorpCodeModule {}