import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.product.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include:{
        supplier:true,
        category:true,
      },
    });
  }

  async findOne(id: string) {
    const productId = parseInt(id, 10);
    return await this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async update(id: string, data: any) {
    const productId = parseInt(id, 10);
    return await this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async remove(id: string) {
    const productId = parseInt(id, 10);
    return await this.prisma.product.delete({
      where: { id: productId },
    });
  }
}