import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EpcService } from './epc.service';
import { CorpCodeService } from 'src/corpcode/corpcode.service';

@Controller('epc')
export class EpcController {
  constructor(private readonly epcService: EpcService) {}

  @Post()
  create(@Body() data: any) {
    return this.epcService.create(data);
  }

  /**
   * Generate EPC batch
   * Body: { corpCodeId, productId, batchName?, batchQuantity, remarks? }
   */
  @Post('generate')
  async generate(@Body() body: any) {
    return await this.epcService.generate(body);
  }

  @Get()
  findAll() {
    return this.epcService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.epcService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.epcService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.epcService.remove(id);
  }

  @Get('batch/:batchName')
  findByBatchName(@Param('batchName') batchName: string) {
    return this.epcService.findByBatchName(batchName);
  }
  @Post('bulk-delete')
  bulkDelete(@Body() body: { ids: number[] }) {
    const ids = body?.ids || [];
    return this.epcService.removeMany(ids);
  }
}

@Controller('corp-code')
export class CorpCodeController {
  constructor(private readonly corpCodeService: CorpCodeService) {}

  /**
   * Get all corp codes
   */
  @Get()
  findAll() {
    return this.corpCodeService.findAll();
  }

  /**
   * Create a new corp code
   * Body: { code: string (4 hex), label?: string }
   */
  @Post()
  create(@Body() data: any) {
    return this.corpCodeService.create(data);
  }

  /**
   * Get single corp code
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corpCodeService.findOne(id);
  }

  /**
   * Update corp code
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.corpCodeService.update(id, data);
  }

  /**
   * Delete corp code
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.corpCodeService.remove(id);
  }
}