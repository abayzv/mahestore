import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './schema/address.schema';
import { Request } from 'express';

@Injectable()
export class AddressesService {

  constructor(@InjectModel(Address.name) private addressModel: Model<Address>) { }

  create(createAddressDto: CreateAddressDto, req: Request) {
    const userId = req['user'].id;
    const data = new this.addressModel({ ...createAddressDto, customer_id: userId });
    return data.save();
  }

  async findAll(req: Request) {
    const userId = req['user'].id;
    const data = await this.addressModel.find({ customer_id: userId }).lean();
    const result = data.map((address) => {
      const { customer_id, ...rest } = address;
      return rest;
    })

    return result;
  }

  async findOne(id: string) {
    const { customer_id, ...result } = await this.addressModel.findById(id).lean();
    return result;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto, req: Request) {
    const userId = req['user'].id;
    await this.addressModel.findByIdAndUpdate(id, { ...updateAddressDto, customer_id: userId })
    const { customer_id, ...result } = await this.addressModel.findById(id).lean()
    return result;
  }

  async remove(id: number) {
    const { customer_id, ...result } = await this.addressModel.findByIdAndDelete(id).lean()
    return result;
  }
}
