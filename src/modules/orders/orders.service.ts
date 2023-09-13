import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Types } from 'mongoose';
import { OrderItemEntity } from './entities/orderItem.entity';
import { ResponseError } from 'src/common/error/error-exception';
import { MidtransService } from '../midtrans/midtrans.service';
import { CreateMidtranDto } from '../midtrans/dto/create-midtran.dto';
import { WhatsappsService } from '../whatsapps/whatsapps.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel('Order') private Order: Model<OrderEntity>,
    @InjectModel('OrderItem') private OrderItem: Model<OrderItemEntity>,
    private midtransService: MidtransService,
    private whatsappsService: WhatsappsService
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
    const orderItemsIds = orderItems.map((orderItem) => {
      return orderItem._id;
    });

    const data = await this.Order.create({
      reference_number: 'MHS-' + Math.floor(Math.random() * 1000) + "-" + Date.now(),
      customer_id: userId,
      date: new Date(),
      address_id: new Types.ObjectId(createOrderDto.address_id),
      expedition_fee: createOrderDto.expedition_fee,
      expedition_name: createOrderDto.expedition_name,
      status: 'pending',
      order_items: orderItemsIds,
      total: total,
    })

    const result = await this.Order.findById(data._id).lean().populate({ path: 'order_items' }).populate('address_id');

    const dataMidtrans: CreateMidtranDto = {
      order_id: new String(result._id).toString(),
      gross_amount: result.total
    }

    const midtrans = await this.midtransService.create(dataMidtrans, req)
    const message = `
-----------------------------------
PT MAHESA DIGITAL INDONESIA
-----------------------------------
*INVOICE*
-----------------------------------
*Order ID:* ${result.reference_number}
*Order Date:* ${result.date.toLocaleDateString()}
*Order Status:* ${result.status}
*Total:* Rp. ${result.total}
*Payment Link:* ${midtrans['redirect_url']}
-----------------------------------
    `
    await this.whatsappsService.sendMessage(req['user'].phoneNumber, message)

    return new OrderEntity(result);
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.Order.find().lean().populate({ path: 'order_items' }).populate('address_id');
    return orders.map((order) => {
      return new OrderEntity(order);
    });
  }

  async findOne(id: string) {
    const order = await this.Order.findById(id).lean().populate({ path: 'order_items' }).populate('address_id');
    return new OrderEntity(order);
  }

  async findOrderItems(id: string) {
    const order = await this.Order.findById(id).lean()
    const orderItem = []

    for (const item of order.order_items) {
      const orderItemData = await this.OrderItem.findById(item._id).lean().populate('product_id');
      orderItem.push(new OrderItemEntity(orderItemData))
    }

    return orderItem;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    const order = await this.Order.findByIdAndDelete(id).lean();
    console.log(order)

    if (!order) {
      throw new ResponseError(404, 'Order not found');
    }

    await this.OrderItem.deleteMany({ _id: { $in: order.order_items } });
    return new OrderEntity(order);
  }
}
