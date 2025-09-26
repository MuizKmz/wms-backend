import { Module } from '@nestjs/common';
import { MaterialModule } from './material/material.module';
import { PrismaService } from './prisma.service';
import { MachineModule } from './machines/machine.module';
import { ToolModule } from './tools/tool.module';
import { MouldModule } from './moulds/mould.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    MaterialModule,
    MachineModule,
    ToolModule,
    MouldModule,
    MaintenanceModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
