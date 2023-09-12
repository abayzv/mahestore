import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ICreateOrder } from './interfaces/create-order.interface';
import { ICreateOrderItem } from './interfaces/create-order-item.interface';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Order } from './schema/order.schema';
import { OrderItem } from './schema/orderItem.schema';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel('Order') private Order: Model<ICreateOrder>,
    @InjectModel('OrderItem') private OrderItem: Model<ICreateOrderItem[]>,
  ) { }

  async create(createOrderDto: CreateOrderDto, req: Request) {
    const userId = req['user'].id;

    let total = 0;
    createOrderDto.order_items.forEach((orderItem) => {
      total += orderItem.unit_price * orderItem.quantity;
    });

    const orderItemsData = createOrderDto.order_items.map((orderItem) => {
      return {
        product_id: new Types.ObjectId(orderItem.product_id),
        quantity: orderItem.quantity,
        unit_price: orderItem.unit_price,
      }
    });

    const orderItems = await this.OrderItem.insertMany(orderItemsData);

    const data = new this.Order({
      reference_number: 'MHS-' + Math.floor(Math.random() * 1000) + "-" + Date.now(),
      customer_id: userId,
      address_id: new Types.ObjectId(createOrderDto.address_id),
      date: new Date(),
      expedition_fee: createOrderDto.expedition_fee,
      expedition_name: createOrderDto.expedition_name,
      status: 'pending',
      total: total,
    });
    await data.save();

    for (const orderItem of orderItems) {
      await this.Order.findByIdAndUpdate(data._id, { $addToSet: { order_items: orderItem._id } });
    }

    return data;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    // return order with address and order items
    return this.Order.findById(id).populate('order_items');
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
