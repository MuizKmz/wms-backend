import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Coerce dates to JS Date objects if they are provided as strings
    const payload: any = { ...data }
    if (payload.shippingDate && typeof payload.shippingDate === 'string') {
      const d = new Date(payload.shippingDate)
      if (!isNaN(d.getTime())) payload.shippingDate = d
      else delete payload.shippingDate
    }

    if (payload.estimatedDeliveryDate && typeof payload.estimatedDeliveryDate === 'string') {
      const d2 = new Date(payload.estimatedDeliveryDate)
      if (!isNaN(d2.getTime())) payload.estimatedDeliveryDate = d2
      else delete payload.estimatedDeliveryDate
    }

    // Ensure orderId is a number (Prisma expects Int)
    if (payload.orderId) payload.orderId = Number(payload.orderId)

    return await this.prisma.shipment.create({ data: payload });
  }

  async findAll() {
    return await this.prisma.shipment.findMany({
      include: {
        order: true,
      },
    });
  }

  async findOne(id: string) {
    const shipmentId = parseInt(id, 10);
    return await this.prisma.shipment.findUnique({ where: { id: shipmentId } });
  }

  async update(id: string, data: any) {
    const shipmentId = parseInt(id, 10);
    const payload: any = { ...data };

    // Handle date conversions (same as create)
    if (payload.shippingDate && typeof payload.shippingDate === 'string') {
      const d = new Date(payload.shippingDate);
      if (!isNaN(d.getTime())) payload.shippingDate = d;
      else delete payload.shippingDate;
    }

    if (payload.estimatedDeliveryDate && typeof payload.estimatedDeliveryDate === 'string') {
      const d2 = new Date(payload.estimatedDeliveryDate);
      if (!isNaN(d2.getTime())) payload.estimatedDeliveryDate = d2;
      else delete payload.estimatedDeliveryDate;
    }

    // Ensure orderId is a number (if provided)
    if (payload.orderId) payload.orderId = Number(payload.orderId);

    // Prevent accidental ID overwrite
    delete payload.id;

    // Perform update
    return await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: payload,
    });
  }

  async remove(id: string) {
    const shipmentId = parseInt(id, 10);
    return await this.prisma.shipment.delete({ where: { id: shipmentId } });
  }
}
