import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Normalize incoming payload so it matches the Prisma Product model
    // Accept either: { category: '<name>' } or { categoryId: number }
    // Accept either: { supplier: '<name>' } or { supplierId: number }

    const {
      skuCode,
      name,
      productCode,
      category,
      categoryId,
      supplier,
      supplierId,
      status,
      remark,
      remarks,
    } = data || {}

    // Resolve categoryId
    let resolvedCategoryId: number | undefined = categoryId
    if (!resolvedCategoryId) {
      if (!category) throw new BadRequestException('Category is required')
      const foundCat = await this.prisma.category.findFirst({ where: { name: String(category) } })
      if (!foundCat) throw new BadRequestException(`Category not found: ${category}`)
      resolvedCategoryId = foundCat.id
    }

    // Resolve supplierId
    let resolvedSupplierId: number | undefined = supplierId
    if (!resolvedSupplierId) {
      if (!supplier) throw new BadRequestException('Supplier is required')
      const foundSup = await this.prisma.supplier.findFirst({ where: { supplierName: String(supplier) } })
      if (!foundSup) throw new BadRequestException(`Supplier not found: ${supplier}`)
      resolvedSupplierId = foundSup.id
    }

    const createData: any = {
      skuCode,
      name,
      productCode,
      categoryId: Number(resolvedCategoryId),
      supplierId: Number(resolvedSupplierId),
      status,
      remarks: remark ?? remarks ?? null,
    }

    return await this.prisma.product.create({ data: createData })
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include:{
        supplier:true,
        category:true,
      },
    });
  }

  async findOne(id: string) {
    const productId = parseInt(id, 10);
    return await this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async update(id: string, data: any) {
    const productId = parseInt(id, 10);
    return await this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async remove(id: string) {
    const productId = parseInt(id, 10);
    return await this.prisma.product.delete({
      where: { id: productId },
    });
  }

  /**
   * Bulk remove products by an array of ids.
   * Tries to delete each product individually; if deletion fails due to FK constraints
   * the product is recorded as blocked with the error message.
   * Returns { deletedIds: number[], blocked: Array<{ id: number, reason: string }> }
   */
  async removeMany(ids: any[]) {
    const parsedIds = (Array.isArray(ids) ? ids : [])
      .map((i) => parseInt(String(i), 10))
      .filter((n) => !Number.isNaN(n));

    const deletedIds: number[] = [];
    const blocked: Array<{ id: number; reason: string }> = [];

    for (const id of parsedIds) {
      try {
        const deleted = await this.prisma.product.delete({
          where: { id },
        });
        deletedIds.push(deleted.id);
      } catch (err: any) {
        // Capture a friendly reason for UI
        const reason =
          (err && (err.message || err.code)) ||
          'Failed to delete (possible dependent records)';
        blocked.push({ id, reason });
      }
    }

    return { deletedIds, blocked };
  }
}