import { Module } from '@nestjs/common';
import { MaterialModule } from './material/material.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [MaterialModule],
  providers: [PrismaService],
})
export class AppModule {}
