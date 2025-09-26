import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, MaterialBatch } from '@prisma/client';

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.materialBatch.findMany({
      include: {
        material: {
          include: {
            supplier: true,
          },
        }
      },
    });
  }
  findOne(id: number) {
    return this.prisma.materialBatch.findUnique({
      where: { id },
      include: {
        material: {
          include: {
            supplier: true,
          },
        }
      },
    });
  }

  create(data: Prisma.MaterialBatchCreateInput): Promise<MaterialBatch> {
    return this.prisma.materialBatch.create({ data });
  }

  update(id: number, data: Prisma.MaterialBatchUpdateInput): Promise<MaterialBatch> {
    return this.prisma.materialBatch.update({ where: { id }, data });
  }

  remove(id: number): Promise<MaterialBatch> {
    return this.prisma.materialBatch.delete({ where: { id } });
  }
}
