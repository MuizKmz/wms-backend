import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {  ShippingService } from './shipping.service';
import {  ShippingController } from './shipping.controller';

@Module({
  controllers: [ShippingController],
  providers: [ShippingService, PrismaService],
})
export class ShipmentModule {}
