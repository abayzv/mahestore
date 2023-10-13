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

@UseInterceptors(ClassSerializerInterceptor, FormatResponseInterceptor)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @SerializeOptions({
    groups: [ORDER_SINGLE]
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.ordersService.create(createOrderDto, req);
  }

  @SerializeOptions({
    groups: [ORDER_LIST]
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.ordersService.findAll(req);
  }

  @SerializeOptions({
    groups: [ORDER_SINGLE]
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/order-items/:id')
  async findAllOrderItems(@Param('id') id: string) {
    const data = await this.ordersService.findOrderItems(id);
    return data
  }

  @SerializeOptions({
    groups: [ORDER_LIST]
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post('/notification')
  async notification(@Body() body: any) {
    await this.ordersService.notification(body);
    return {}
  }
}
