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

  numberToIDR(number: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)
  }

  constructor(
    @InjectModel('Order') private Order: Model<OrderEntity>,
    @InjectModel('OrderItem') private OrderItem: Model<OrderItemEntity>,
    private midtransService: MidtransService,
    private whatsappsService: WhatsappsService
  ) { }

  async create(createOrderDto: CreateOrderDto, req: Request) {
    const userId = req['user'].id;
    const products = []

    let total = createOrderDto.expedition_fee;
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
      payment_token: '',
      payment_url: '',
      order_items: orderItemsIds,
      total: total,
    })

    const dataMidtrans: CreateMidtranDto = {
      order_id: new String(data._id).toString(),
      gross_amount: data.total
    }
    const midtrans = await this.midtransService.create(dataMidtrans, req)
    await this.Order.findByIdAndUpdate(data._id, {
      payment_token: midtrans['token'],
      payment_url: midtrans['redirect_url']
    })

    const result = await this.Order.findById(data._id).lean().populate({ path: 'order_items' }).populate('address_id');
    const orderList = await this.findOrderItems(new String(data._id).toString())

    let orderTotal = 0
    const message = `
-----------------------------------
PT MAHESA DIGITAL INDONESIA
-----------------------------------
*INVOICE*
-----------------------------------
*Customer Name:* ${req['user'].user.firstName + ' ' + req['user'].user.lastName}
*Order ID:* ${result.reference_number}
*Order Date:* ${result.date.toLocaleDateString()}
*Order Status:* ${result.status}  
-----------------------------------
*Product List*
-----------------------------------
${orderList.map((item) => {
      orderTotal += item.unit_price * item.quantity
      return `
*Product Name:* ${item.product_id.name}
*Quantity:* ${item.quantity}
*Unit Price:* Rp. ${this.numberToIDR(item.unit_price)}
*Sub Total:* Rp. ${this.numberToIDR((item.unit_price * item.quantity))}
`
    })}
-----------------------------------
*Order Total:* Rp. ${this.numberToIDR(orderTotal)}
*Expedition Fee:* Rp. ${this.numberToIDR(result.expedition_fee)}
-----------------------------------
*Grand Total:* Rp. ${this.numberToIDR(result.total)}
-----------------------------------
*Payment Link:* ${midtrans['redirect_url']}
-----------------------------------
    `
    await this.whatsappsService.sendMessage(req['user'].phoneNumber, message)

    return new OrderEntity(result);
  }

  async findAll(req: Request): Promise<OrderEntity[]> {
    const userId = req['user'].id;
    const roleId = req['user'].role.id;

    let orders = null;

    if (roleId === 1) {
      orders = await this.Order.find().lean().populate({ path: 'order_items' }).populate('address_id');
    } else {
      orders = await this.Order.find({ customer_id: userId }).lean().populate({ path: 'order_items' }).populate('address_id');
    }

    const newOrders = orders.map(async (order) => {
      const orderData = new OrderEntity(order);
      const orderItems = await this.findOrderItems(new String(order._id).toString())

      const items = {
        thumbnail: orderItems[0].product_id.media_url,
        name: orderItems[0].product_id.name,
        total_items: orderItems.length,
      }

      orderData['items'] = items;

      return orderData;
    });
    return await Promise.all(newOrders);
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
