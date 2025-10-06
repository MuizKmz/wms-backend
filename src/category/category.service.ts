import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Calculate level based on parent
    let level = 1;
    if (data.parentCategoryId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentCategoryId }
      });
      level = parent ? parent.level + 1 : 1;
    }

    return await this.prisma.category.create({
      data: {
        ...data,
        level // Add calculated level
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const categoryId = parseInt(id, 10);
    return await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }

  async update(id: string, data: any) {
    const categoryId = parseInt(id, 10);
    return await this.prisma.category.update({
      where: { id: categoryId },
      data,
    });
  }

  async remove(id: string) {
    const categoryId = parseInt(id, 10);
    return await this.prisma.category.delete({
      where: { id: categoryId },
    });
  }
}