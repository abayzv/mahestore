import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema/product.schema';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { MediasModule } from '../medias/medias.module';


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
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MediasModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
