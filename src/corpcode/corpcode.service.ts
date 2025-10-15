import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CorpCodeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all corp codes
   */
  async findAll() {
    return await this.prisma.corpCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new corp code
   * code: Must be exactly 4 hexadecimal characters (0-9, A-F)
   * label: Optional description
   */
  async create(data: any) {
    const code = (data.code || '').toUpperCase().trim();
    const label = (data.label || '').trim() || null;

    // Validate format: 4 hex characters
    if (!/^[0-9A-F]{4}$/.test(code)) {
      throw new BadRequestException(
        'Corp Code must be exactly 4 hexadecimal characters (0-9, A-F)'
      );
    }

    // Check for duplicates
    const existing = await this.prisma.corpCode.findUnique({
      where: { code },
    });

    if (existing) {
      throw new BadRequestException(`Corp Code ${code} already exists`);
    }

    return await this.prisma.corpCode.create({
      data: {
        code,
        label,
      },
    });
  }

  /**
   * Get single corp code by ID
   */
  async findOne(id: string) {
    const corpCodeId = parseInt(id, 10);
    const corpCode = await this.prisma.corpCode.findUnique({
      where: { id: corpCodeId },
    });

    if (!corpCode) {
      throw new BadRequestException(`Corp Code with ID ${id} not found`);
    }

    return corpCode;
  }

  /**
   * Update corp code
   */
  async update(id: string, data: any) {
    const corpCodeId = parseInt(id, 10);

    // If updating code, validate format
    if (data.code) {
      const code = (data.code || '').toUpperCase().trim();
      if (!/^[0-9A-F]{4}$/.test(code)) {
        throw new BadRequestException(
          'Corp Code must be exactly 4 hexadecimal characters'
        );
      }

      // Check for duplicate (excluding self)
      const existing = await this.prisma.corpCode.findUnique({
        where: { code },
      });

      if (existing && existing.id !== corpCodeId) {
        throw new BadRequestException(`Corp Code ${code} already exists`);
      }

      data.code = code;
    }

    if (data.label) {
      data.label = data.label.trim() || null;
    }

    return await this.prisma.corpCode.update({
      where: { id: corpCodeId },
      data,
    });
  }

  /**
   * Delete corp code (only if no EPCs are using it)
   */
  async remove(id: string) {
    const corpCodeId = parseInt(id, 10);

    // Check if any EPCs use this corp code
    const epcCount = await this.prisma.epc.count({
      where: { corpCodeId },
    });

    if (epcCount > 0) {
      throw new BadRequestException(
        `Cannot delete Corp Code. It is used by ${epcCount} EPC record(s).`
      );
    }

    return await this.prisma.corpCode.delete({
      where: { id: corpCodeId },
    });
  }

  /**
   * Find corp code by hex code value
   */
  async findByCode(code: string) {
    return await this.prisma.corpCode.findUnique({
      where: { code: code.toUpperCase() },
    });
  }
}