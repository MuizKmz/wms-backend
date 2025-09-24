import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Tool } from '@prisma/client';

@Injectable()
export class ToolService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Tool[]> {
    return this.prisma.tool.findMany({
      include: {
        machine: true, // expand machine details
      },
    });
  }

  findOne(id: number): Promise<Tool | null> {
    return this.prisma.tool.findUnique({
      where: { id },
      include: {
        machine: true,
      },
    });
  }

  create(data: Prisma.ToolCreateInput): Promise<Tool> {
    return this.prisma.tool.create({ data });
  }

  update(id: number, data: Prisma.ToolUpdateInput): Promise<Tool> {
    return this.prisma.tool.update({ where: { id }, data });
  }

  remove(id: number): Promise<Tool> {
    return this.prisma.tool.delete({ where: { id } });
  }
}
