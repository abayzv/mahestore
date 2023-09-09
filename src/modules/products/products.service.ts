import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { IProduct } from '../../interfaces/product.interface';
import { ResponseError } from '../../common/error/error-exception';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private productModel: Model<IProduct>) { }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {

    const isExist = await this.productModel.findOne({ name: createProductDto.name });

    if (isExist) {
      throw new ResponseError(400, 'Product already exist')
    }

    const product = new this.productModel(createProductDto);
    product.save();
    return new ProductEntity(product.toObject());
  }

  async findAll(): Promise<ProductEntity[]> {
    const products: ProductEntity[] = await this.productModel.find().lean();
    return products.map(product => new ProductEntity(product));
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productModel.findById(id).lean();
    return new ProductEntity(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<IProduct> {

    const existingProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
    )

    return existingProduct;

  }

  remove(id: string) {
    return this.productModel.findByIdAndRemove(id);
  }
}

