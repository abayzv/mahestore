import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderSchema } from './schema/order.schema';
import { OrderItemSchema } from './schema/orderItem.schema';
import { MidtransModule } from '../midtrans/midtrans.module';
import { WhatsappsModule } from '../whatsapps/whatsapps.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        dbName: config.get<string>('MONGODB_DB_NAME'),
      }),
    }),
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'OrderItem', schema: OrderItemSchema }
    ]),
    MidtransModule,
    WhatsappsModule,
    ProductsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
