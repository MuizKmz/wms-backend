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
}