import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from '../products/products.module';
import { CartSchema } from './carts.schema';

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
      { name: 'Cart', schema: CartSchema },
    ]),
    ProductsModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule { }
