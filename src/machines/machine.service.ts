import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Machine } from '@prisma/client';

@Injectable()
export class MachineService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Machine[]> {
    return this.prisma.machine.findMany();
  }

  findOne(id: number): Promise<Machine | null> {
    return this.prisma.machine.findUnique({ where: { id } });
  }

  create(data: Prisma.MachineCreateInput): Promise<Machine> {
    return this.prisma.machine.create({ data });
  }

  update(id: number, data: Prisma.MachineUpdateInput): Promise<Machine> {
    return this.prisma.machine.update({ where: { id }, data });
  }

  remove(id: number): Promise<Machine> {
    return this.prisma.machine.delete({ where: { id } });
  }
}
