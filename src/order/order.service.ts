import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { orderItems, ...orderData } = data;
    
    const createdBy =
      data.createdBy !== undefined && data.createdBy !== null
        ? data.createdBy
        : 1;

    const estimatedDeliveryTime = data.estimatedDeliveryTime
      ? new Date(data.estimatedDeliveryTime)
      : undefined;

    const nestedItems = Array.isArray(orderItems)
      ? orderItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      : [];

    return await this.prisma.order.create({
      data: {
        ...orderData,
        createdBy,
        estimatedDeliveryTime,
        orderItems: {
          create: nestedItems,
        },
      },
      include: {
        customer: true,
        supplier: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        shipments: true,
        creator: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.order.findMany({
      include: {
        customer: true,
        supplier: true,
        orderItems: { include: { product: true } },
        shipments: true,
        creator: true,
      },
    });
  }

  async findOne(id: string) {
    const orderId = parseInt(id, 10);
    return await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        supplier: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        shipments: true,
        creator: true,
      },
    });
  }

  async update(id: string, data: any) {
    const orderId = parseInt(id, 10);
    return await this.prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        customer: true,
        supplier: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        shipments: true,
        creator: true,
      },
    });
  }

  async remove(id: string) {
    const orderId = parseInt(id, 10);
    return await this.prisma.order.delete({
      where: { id: orderId },
    });
  }
}