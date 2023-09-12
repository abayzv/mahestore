import { Injectable, Inject } from '@nestjs/common';
import { CreateMidtranDto } from './dto/create-midtran.dto';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransaction } from './midtrans.interface';
import { Request } from 'express';

@Injectable()
export class MidtransService {
  constructor(
    @Inject('MIDTRANS_SERVICE') private client: ClientProxy,
  ) { }

  async create(createMidtranDto: CreateMidtranDto, req: Request) {
    const user = req['user'].user;

    const data: CreateTransaction = {
      transaction_details: {
        order_id: createMidtranDto.order_id,
        gross_amount: createMidtranDto.gross_amount,
      },
      customer_details: {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      }
    }

    return this.client.send('create_transaction', data);
  }

  findOne(id: string) {
    return this.client.send('get_status_transaction', id);
  }
}
