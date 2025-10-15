import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceivingService } from './receiving.service';

@Controller('receiving')
export class ReceivingController {
  constructor(private readonly receivingService: ReceivingService) {}

  @Post()
  create(@Body() data: any) {
    return this.receivingService.create(data);
  }

  @Get()
  findAll() {
    return this.receivingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivingService.findOne(id);
  }

  @Patch(':id/items')
  updateItems(@Param('id') id: string, @Body() data: any) {
    return this.receivingService.updateItems(id, data.receivingItems);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.receivingService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receivingService.remove(id);
  }
}