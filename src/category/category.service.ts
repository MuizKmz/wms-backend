import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Calculate level based on parent
    let level = 1;
    if (data.parentCategoryId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentCategoryId }
      });
      level = parent ? parent.level + 1 : 1;
    }

    return await this.prisma.category.create({
      data: {
        ...data,
        level // Add calculated level
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const categoryId = parseInt(id, 10);
    return await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }

  async update(id: string, data: any) {
    const categoryId = parseInt(id, 10);
    return await this.prisma.category.update({
      where: { id: categoryId },
      data,
    });
  }

  async remove(id: string) {
    const categoryId = parseInt(id, 10);

    // Collect this category and all descendants (iterative BFS)
    const idsToDelete: number[] = [];
    const queue: number[] = [categoryId];

    while (queue.length) {
      const current = queue.shift();
      if (current === undefined) break;
      idsToDelete.push(current);

      const children = await this.prisma.category.findMany({
        where: { parentCategoryId: current },
        select: { id: true },
      });

      for (const c of children) {
        // avoid duplicates
        if (!idsToDelete.includes(c.id) && !queue.includes(c.id)) {
          queue.push(c.id);
        }
      }
    }

    // Check for dependent products under any category to be deleted
    const blocked: Array<{ id: number; productsCount: number }> = [];

    for (const cid of idsToDelete) {
      const productsCount = await this.prisma.product.count({ where: { categoryId: cid } });
      if (productsCount > 0) {
        blocked.push({ id: cid, productsCount });
      }
    }

    if (blocked.length > 0) {
      // Do not delete anything if there are dependent products. Return details so caller can act.
      return { deletedIds: [], blocked };
    }

    // Safe to delete all collected categories
    await this.prisma.category.deleteMany({ where: { id: { in: idsToDelete } } });

    return { deletedIds: idsToDelete, blocked: [] };
  }

  /**
   * Bulk remove categories by an array of root ids.
   * For each requested id, collect its descendants, check for dependent products,
   * and delete only the safe ones. Return details for deleted IDs and blocked entries.
   */
  async removeMany(ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { deletedIds: [], blocked: [] };
    }

    const allDeletedIds: number[] = [];
    const blocked: Array<{ id: number; productsCount: number }> = [];

    for (const rootId of ids) {
      // Collect this root and all descendants
      const idsToDelete: number[] = [];
      const queue: number[] = [rootId];

      while (queue.length) {
        const current = queue.shift();
        if (current === undefined) break;
        if (!idsToDelete.includes(current)) idsToDelete.push(current);

        const children = await this.prisma.category.findMany({
          where: { parentCategoryId: current },
          select: { id: true },
        });

        for (const c of children) {
          if (!idsToDelete.includes(c.id) && !queue.includes(c.id)) {
            queue.push(c.id);
          }
        }
      }

      // Check for dependent products under any of those category ids
      let hasBlocked = false;
      for (const cid of idsToDelete) {
        const productsCount = await this.prisma.product.count({ where: { categoryId: cid } });
        if (productsCount > 0) {
          blocked.push({ id: cid, productsCount });
          hasBlocked = true;
        }
      }

      if (!hasBlocked) {
        // Safe to delete this subtree
        await this.prisma.category.deleteMany({ where: { id: { in: idsToDelete } } });
        allDeletedIds.push(...idsToDelete);
      }
      // If blocked, we don't delete that subtree. Continue to next requested id.
    }

    return { deletedIds: allDeletedIds, blocked };
  }
}