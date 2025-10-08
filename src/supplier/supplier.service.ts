import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.supplier.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.supplier.findMany();
  }

  async findOne(id: string) {
    const supplierId = parseInt(id, 10);
    return await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
  }

  async update(id: string, data: any) {
    const supplierId = parseInt(id, 10);
    return await this.prisma.supplier.update({
      where: { id: supplierId },
      data,
    });
  }

  async remove(id: string) {
    const supplierId = parseInt(id, 10);
    return await this.prisma.supplier.delete({
      where: { id: supplierId },
    });
  }

  // Remove multiple suppliers by array of ids
  async removeMany(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { deletedIds: [], blocked: [] };

    const parsed = ids
      .map((i) => parseInt(String(i), 10))
      .filter((n) => !Number.isNaN(n));

    const deletedIds: number[] = [];
    const blocked: Array<{ id: number; productsCount: number; receivingsCount: number; ordersCount: number }> = [];

    // Process each id separately so we can report which ones failed due to FK constraints
    for (const id of parsed) {
      // count dependent records
      const productsCount = await this.prisma.product.count({ where: { supplierId: id } });
      const receivingsCount = await this.prisma.receiving.count({ where: { supplierId: id } });
      const ordersCount = await this.prisma.order.count({ where: { supplierId: id } });

      if (productsCount === 0 && receivingsCount === 0 && ordersCount === 0) {
        // safe to delete
        await this.prisma.supplier.delete({ where: { id } });
        deletedIds.push(id);
      } else {
        blocked.push({ id, productsCount, receivingsCount, ordersCount });
      }
    }

    return { deletedIds, blocked };
  }
}
