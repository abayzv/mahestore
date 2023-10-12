import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { Request } from 'express';

@Injectable()
export class CartsService {

  constructor(
    @InjectModel('Cart') private Cart: Model<CartEntity>,
  ) { }

  async create(createCartDto: CreateCartDto, req: Request) {
    const userId = req['user'].id;

    const isCartExist = await this.Cart.findOneAndUpdate(
      { product_id: createCartDto.product_id, customer_id: userId },
      { $inc: { quantity: createCartDto.quantity } },
      { new: true })
      .lean().populate('product_id');

    if (isCartExist) {
      return new CartEntity(isCartExist);
    }
    const cart = await this.Cart.create({ ...createCartDto, customer_id: userId });
    const result = await this.Cart.findById(cart._id).lean().populate('product_id');

    return new CartEntity(result);
  }

  async findAll(req: Request) {
    const customer_id = req['user'].id;

    const carts = await this.Cart.find({ customer_id }).lean().populate('product_id');
    return carts.map(cart => new CartEntity(cart));
  }

  async findOne(id: string) {
    const cart = await this.Cart.findById(id).lean().populate('product_id');
    return new CartEntity(cart);
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.Cart.findByIdAndUpdate(id, updateCartDto, { new: true }).lean().populate('product_id');
    return new CartEntity(cart);
  }

  async remove(id: string) {
    const cart = await this.Cart.findByIdAndDelete(id).lean().populate('product_id');
    return new CartEntity(cart);
  }
}
