import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionService } from './section.service';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() data: any) {
    return this.sectionService.create(data);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.sectionService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionService.remove(id);
  }
}
