import { Injectable, Inject } from '@nestjs/common';
import { CreateMidtranDto } from './dto/create-midtran.dto';
import { UpdateMidtranDto } from './dto/update-midtran.dto';
import { ClientProxy } from '@nestjs/microservices';
import { FindOneEvent } from './midtrans.events';

@Injectable()
export class MidtransService {
  constructor(
    @Inject('MIDTRANS_SERVICE') private client: ClientProxy,
  ) { }

  create(createMidtranDto: CreateMidtranDto) {
    return 'This action adds a new midtran';
  }

  findAll() {
    return `This action returns all midtrans`;
  }

  findOne(id: string) {
    this.client.emit('hello', new FindOneEvent(1));
    return `This action returns a #${id} midtran`;
  }

  update(id: number, updateMidtranDto: UpdateMidtranDto) {
    return `This action updates a #${id} midtran`;
  }

  remove(id: number) {
    return `This action removes a #${id} midtran`;
  }
}
