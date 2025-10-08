import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RackService } from './rack.service';

@Controller('rack')
export class RackController {
  constructor(private readonly rackService: RackService) {}

  @Post()
  create(@Body() data: any) {
    return this.rackService.create(data);
  }

  @Get()
  findAll() {
    return this.rackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rackService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.rackService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rackService.remove(id);
  }
}
