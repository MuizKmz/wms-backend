import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.customer.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.customer.findMany();
  }

  async findOne(id: string) {
    const customerId = parseInt(id, 10);
    return await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
  }

  async update(id: string, data: any) {
    const customerId = parseInt(id, 10);
    return await this.prisma.customer.update({
      where: { id: customerId },
      data,
    });
  }

  async remove(id: string) {
    const customerId = parseInt(id, 10);
    return await this.prisma.customer.delete({
      where: { id: customerId },
    });
  }

  // Remove multiple suppliers by array of ids
  async removeMany(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) return { deletedIds: [], blocked: [] };
    const parsed = ids
      .map((i) => parseInt(String(i), 10))
      .filter((n) => !Number.isNaN(n));
    const deletedIds: number[] = [];
    const blocked: Array<{ id: number; ordersCount: number }> = [];
    // Process each id separately so we can report which ones failed due to FK constraints
    for (const id of parsed) {
      // count dependent records
      const ordersCount = await this.prisma.order.count({ where: { customerId: id } });
      if (ordersCount === 0) {
        // safe to delete
        await this.prisma.customer.delete({ where: { id } });
        deletedIds.push(id);
      } else {
        blocked.push({ id, ordersCount });
      }
    }
    return { deletedIds, blocked };
  }
}
