import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() data: any) {
    return this.inventoryService.create(data);
  }

  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.inventoryService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
