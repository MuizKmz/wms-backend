import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Maintenance } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.maintenance.findMany({
      include: {
        machine: true,
      },
    });
  }
  findOne(id: number) {
    return this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        machine: true,
      },
    });
  }

  create(data: Prisma.MaintenanceCreateInput): Promise<Maintenance> {
    return this.prisma.maintenance.create({ data });
  }

  update(id: number, data: Prisma.MaintenanceUpdateInput): Promise<Maintenance> {
    return this.prisma.maintenance.update({ where: { id }, data });
  }

  remove(id: number): Promise<Maintenance> {
    return this.prisma.maintenance.delete({ where: { id } });
  }
}
