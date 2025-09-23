import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Material } from '@prisma/client';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Material[]> {
    return this.prisma.material.findMany();
  }

  findOne(id: number): Promise<Material | null> {
    return this.prisma.material.findUnique({ where: { id } });
  }

  create(data: Prisma.MaterialCreateInput): Promise<Material> {
    return this.prisma.material.create({ data });
  }

  update(id: number, data: Prisma.MaterialUpdateInput): Promise<Material> {
    return this.prisma.material.update({ where: { id }, data });
  }

  remove(id: number): Promise<Material> {
    return this.prisma.material.delete({ where: { id } });
  }
}
