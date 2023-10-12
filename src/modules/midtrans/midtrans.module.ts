import { Module } from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { MidtransController } from './midtrans.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const host = new ConfigService().get('MIDTRANS_SERVICE_HOST');
const port = new ConfigService().get('MIDTRANS_SERVICE_PORT');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MIDTRANS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: "midtrans-services-api-1",
          port: 5003,
        }
      }
    ]),
  ],
  exports: [MidtransService],
  controllers: [MidtransController],
  providers: [MidtransService],
})
export class MidtransModule { }
