import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WarehouseService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.warehouse.create({ data });
  }

  async findAll() {
    return await this.prisma.warehouse.findMany({
      include: {
        racks: true,
        sections: true,
        receivings: true,
        inventory: true,
      },
    });
  }

  async findOne(id: string) {
    const warehouseId = parseInt(id, 10);
    return await this.prisma.warehouse.findUnique({ where: { id: warehouseId } });
  }

  async update(id: string, data: any) {
    const warehouseId = parseInt(id, 10);
    return await this.prisma.warehouse.update({ where: { id: warehouseId }, data });
  }

  async remove(id: string) {
    const warehouseId = parseInt(id, 10);
    return await this.prisma.warehouse.delete({ where: { id: warehouseId } });
  }
}
