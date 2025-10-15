import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EpcService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return await this.prisma.epc.create({ data });
  }

  /**
   * Generate EPC codes in bulk using the format:
   * epc = corpCode(4 hex) + skuCode(8 hex) + date(DDMMYY 6 chars) + runNo(6 digits, zero padded)
   * 
   * The endpoint expects: corpCodeId, productId, batchName, batchQuantity, remarks
   * - corpCodeId: ID of the selected/created corp code
   * - productId: ID of the product (contains skuCode)
   * - batchQuantity: Number of EPCs to generate (e.g., 10 generates 000001-000010)
   */
  async generate(body: any) {
    const corpCodeId: number = body.corpCodeId;
    const productId: number = body.productId;
    const batchName: string | null = body.batchName || null;
    const batchQuantity: number = Number(body.batchQuantity) || 0;

    if (!corpCodeId || !productId || batchQuantity < 1) {
      throw new Error('Missing required fields: corpCodeId, productId, or invalid batchQuantity');
    }

    // Fetch corp code and product with validation
    const corpCode = await this.prisma.corpCode.findUnique({
      where: { id: corpCodeId }
    });

    if (!corpCode) {
      throw new Error('Corp Code not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !product.skuCode) {
      throw new Error('Product not found or missing SKU Code');
    }

    // Validate formats
    if (!/^[0-9A-F]{4}$/i.test(corpCode.code)) {
      throw new Error('Invalid corpCode format. Must be 4 hexadecimal characters.');
    }
    if (!/^[0-9A-F]{8}$/i.test(product.skuCode)) {
      throw new Error('Invalid skuCode format. Must be 8 hexadecimal characters.');
    }

    // Generate date string (DDMMYY)
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    const dateStr = `${dd}${mm}${yy}`;

    // Find the highest existing serial number for this corp+sku+date combination
    const prefix = `${corpCode.code}${product.skuCode}${dateStr}`;
    const existingEpcs = await this.prisma.epc.findMany({
      where: {
        epcCode: {
          startsWith: prefix
        }
      },
      orderBy: {
        epcCode: 'desc'
      },
      take: 1
    });

    // Determine starting serial number
    let startSerial = 1;
    if (existingEpcs.length > 0) {
      const lastEpcCode = existingEpcs[0].epcCode;
      const lastSerial = parseInt(lastEpcCode.slice(-6), 10);
      startSerial = lastSerial + 1;
    }

    const created: any[] = [];

    // Generate batchQuantity EPCs with sequential serial numbers
    for (let i = 0; i < batchQuantity; i++) {
      const serialNumber = startSerial + i;
      const runNo = String(serialNumber).padStart(6, '0');
      const epcCode = `${prefix}${runNo}`;

      const rec = await this.prisma.epc.create({
        data: {
          epcCode,
          productId,
          corpCodeId,
          batchName,
          batchNumber: i + 1, // Tracks which EPC in the batch (1-10)
          status: 'GENERATED',
        },
      });

      created.push({
        id: rec.id,
        epcCode,
        serialNumber: runNo, // Display as 000001, 000002, etc.
        batchNumber: i + 1
      });
    }

    return {
      created,
      count: created.length,
      batchInfo: {
        corpCode: corpCode.code,
        productId,
        batchName,
        startingSerialNumber: String(startSerial).padStart(6, '0'),
        endingSerialNumber: String(startSerial + batchQuantity - 1).padStart(6, '0'),
        dateGenerated: new Date().toISOString(),
      }
    };
  }

  async findAll() {
    return await this.prisma.epc.findMany({
      include: {
        product: true,
        corpCode: true,
      },
    });
  }

  async findOne(id: string) {
    const epcId = parseInt(id, 10);
    return await this.prisma.epc.findUnique({
      where: { id: epcId },
      include: {
        product: true,
        corpCode: true,
      },
    });
  }

  async update(id: string, data: any) {
    const epcId = parseInt(id, 10);
    return await this.prisma.epc.update({
      where: { id: epcId },
      data,
      include: {
        product: true,
        corpCode: true,
      },
    });
  }

  async remove(id: string) {
    const epcId = parseInt(id, 10);
    return await this.prisma.epc.delete({
      where: { id: epcId },
    });
  }

  /**
   * Bulk delete multiple EPCs by their IDs
   */
  async removeMany(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new Error('No IDs provided for deletion');
    }

    // Validate all IDs are valid numbers
    const validIds = ids.filter(id => !isNaN(id) && id > 0);
    
    if (validIds.length === 0) {
      throw new Error('No valid IDs provided for deletion');
    }

    // Perform bulk delete
    const result = await this.prisma.epc.deleteMany({
      where: {
        id: {
          in: validIds
        }
      }
    });

    return {
      success: true,
      deletedCount: result.count,
      message: `Successfully deleted ${result.count} EPC record(s)`
    };
  }

  async findByBatchName(batchName: string) {
    return await this.prisma.epc.findMany({
      where: { batchName },
      include: {
        product: true,
        corpCode: true,
      },
    });
  }
}