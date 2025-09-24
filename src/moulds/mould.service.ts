import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Mould, Prisma } from '@prisma/client';

@Injectable()
export class MouldService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.mould.findMany({
      include: {
        machine: true, // expand machine details
      },
    });
  }

  findOne(id: number) {
    return this.prisma.mould.findUnique({
      where: { id },
      include: {
        machine: true,
      },
    });
  }

  create(data: Prisma.MouldCreateInput): Promise<Mould> {
    return this.prisma.mould.create({ data });
  }

  update(id: number, data: Prisma.MouldUpdateInput): Promise<Mould> {
    return this.prisma.mould.update({ where: { id }, data });
  }

  remove(id: number): Promise<Mould> {
    return this.prisma.mould.delete({ where: { id } });
  }
}
