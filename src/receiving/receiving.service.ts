import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReceivingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Receiving record and all related ReceivingItems using nested writes.
   */
  async create(data: any) {
    const { receivingItems, ...receivingData } = data;
    const createdBy =
      data.createdBy !== undefined && data.createdBy !== null
        ? data.createdBy
        : 1;

    const receivingDate = receivingData.receivingDate
      ? new Date(receivingData.receivingDate)
      : undefined;

    const nestedItems = Array.isArray(receivingItems)
      ? receivingItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unit: item.unit || 'pcs',
        }))
      : [];

    return await this.prisma.receiving.create({
      data: {
        ...receivingData,
        receivingDate,
        createdBy,
        receivingItems: {
          create: nestedItems,
        },
      },
      include: {
        warehouse: true,
        supplier: true,
        receivingItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Finds all Receiving records and includes all related items and product details.
   */
  async findAll() {
    return await this.prisma.receiving.findMany({
      include: {
        warehouse: true,
        supplier: true,
        receivingItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Finds a single Receiving record by ID and includes all related items and product details.
   */
  async findOne(id: string) {
    const receivingId = parseInt(id, 10);
    return await this.prisma.receiving.findUnique({
      where: { id: receivingId },
      include: {
        warehouse: true,
        supplier: true,
        receivingItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Updates a Receiving record. Handles date normalization.
   * For nested item updates, use the dedicated updateItems method or handle separately.
   */
  async update(id: string, data: any) {
    const receivingId = parseInt(id, 10);
    const { receivingItems, ...receivingData } = data;

    // Normalize receivingDate if provided
    if (receivingData.receivingDate) {
      receivingData.receivingDate = new Date(receivingData.receivingDate);
    }

    return await this.prisma.receiving.update({
      where: { id: receivingId },
      data: receivingData,
      include: {
        warehouse: true,
        supplier: true,
        receivingItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Updates ReceivingItems for a specific Receiving record.
   * Deletes all existing items and creates new ones (or use updateMany for partial updates).
   */
  async updateItems(id: string, receivingItems: any[]) {
    const receivingId = parseInt(id, 10);

    const nestedItems = Array.isArray(receivingItems)
      ? receivingItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          unit: item.unit || 'pcs',
        }))
      : [];

    // Delete all existing items and create new ones
    return await this.prisma.receiving.update({
      where: { id: receivingId },
      data: {
        receivingItems: {
          deleteMany: {},
          create: nestedItems,
        },
      },
      include: {
        warehouse: true,
        supplier: true,
        receivingItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const receivingId = parseInt(id, 10);
    return await this.prisma.receiving.delete({
      where: { id: receivingId },
    });
  }
}