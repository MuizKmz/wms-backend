import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.inventory.create({ data });
  }

  async findAll(categoryId?: string) {
    const where: any = {}

    if (categoryId) {
      const cid = parseInt(categoryId, 10)
      // Filter inventories whose product belongs to the given category
      // Prisma relation filter: product: { is: { categoryId: cid } }
      where.product = { is: { categoryId: cid } }
    }

    return await this.prisma.inventory.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        product: { include: { category: true } },
        warehouse: true,
        rack: true,
        section: true,
      },
    });
  }

  async findOne(id: string) {
    const inventoryId = parseInt(id, 10);
    return await this.prisma.inventory.findUnique({ where: { id: inventoryId } });
  }

  async update(id: string, data: any) {
    const inventoryId = parseInt(id, 10);
    return await this.prisma.inventory.update({ where: { id: inventoryId }, data });
  }

  async remove(id: string) {
    const inventoryId = parseInt(id, 10);
    return await this.prisma.inventory.delete({ where: { id: inventoryId } });
  }
}
