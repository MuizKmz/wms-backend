import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.section.create({ data });
  }

  async findAll() {
    return await this.prisma.section.findMany({
      include: {
        warehouse: true,
        rack: true,
        inventory: true,
      },
    });
  }

  async findOne(id: string) {
    const sectionId = parseInt(id, 10);
    return await this.prisma.section.findUnique({ where: { id: sectionId } });
  }

  async update(id: string, data: any) {
    const sectionId = parseInt(id, 10);
    return await this.prisma.section.update({ where: { id: sectionId }, data });
  }

  async remove(id: string) {
    const sectionId = parseInt(id, 10);
    return await this.prisma.section.delete({ where: { id: sectionId } });
  }
}
