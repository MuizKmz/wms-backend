import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RackService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.rack.create({ data });
  }

  async findAll() {
    return await this.prisma.rack.findMany({
      include: {
        warehouse: true,
        sections: true,
        inventory:{
          include:{
            product:true
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const rackId = parseInt(id, 10);
    return await this.prisma.rack.findUnique({ where: { id: rackId } });
  }

  async update(id: string, data: any) {
    const rackId = parseInt(id, 10);
    return await this.prisma.rack.update({ where: { id: rackId }, data });
  }

  async remove(id: string) {
    const rackId = parseInt(id, 10);
    return await this.prisma.rack.delete({ where: { id: rackId } });
  }
}
