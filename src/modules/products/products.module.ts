import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', { dbName: 'nestjs' }),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
