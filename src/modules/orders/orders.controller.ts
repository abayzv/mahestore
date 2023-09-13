import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, SerializeOptions } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptors';
import { ORDER_SINGLE, ORDER_LIST } from './entities/order.entity';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor, FormatResponseInterceptor)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthGuard)
  @SerializeOptions({
    groups: [ORDER_SINGLE]
  })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create(createOrderDto, req);
  }

  @SerializeOptions({
    groups: [ORDER_LIST]
  })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @SerializeOptions({
    groups: [ORDER_SINGLE]
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('/order-items/:id')
  async findAllOrderItems(@Param('id') id: string) {
    const data = await this.ordersService.findOrderItems(id);
    return data
  }

  @SerializeOptions({
    groups: [ORDER_LIST]
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
