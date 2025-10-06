import { Module } from '@nestjs/common';
// import { MaterialModule } from './material/material.module';
import { PrismaService } from './prisma.service';
import { SupplierModule } from './supplier/supplier.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
// import { MachineModule } from './machines/machine.module';
// import { ToolModule } from './tools/tool.module';
// import { MouldModule } from './moulds/mould.module';
// import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    SupplierModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
