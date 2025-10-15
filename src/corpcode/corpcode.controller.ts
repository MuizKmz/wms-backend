import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CorpCodeService } from './corpcode.service';

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