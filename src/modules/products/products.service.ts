import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { IProduct } from './interface/product.interface';
import { ResponseError } from '../../common/error/error-exception';
import { ProductEntity } from './entities/product.entity';
import { MediasService } from '../medias/medias.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private productModel: Model<IProduct>,
    private mediaService: MediasService
  ) { }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {

    const isExist = await this.productModel.findOne({ name: createProductDto.name });

    if (isExist) {
      throw new ResponseError(400, 'Product already exist')
    }

    let media_url = '';

    if (createProductDto.media_id !== '0') {
      const media = await this.mediaService.findOne(createProductDto.media_id);

      if (!media) throw new ResponseError(400, 'Media not found');

      media_url = media.path;
    } else {
      media_url = createProductDto.media_url;
    }

    const product = new this.productModel({ ...createProductDto, media_url: media_url });
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

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {

    if (updateProductDto.media_id) {
      const media = await this.mediaService.findOne(updateProductDto.media_id);

      const existingProduct = await this.productModel.findByIdAndUpdate(id, { ...updateProductDto, media_url: media.path }, { new: true }).lean();
      return new ProductEntity(existingProduct);
    } else {
      const data = await this.productModel.findByIdAndUpdate(id, { ...updateProductDto }, { new: true }).lean();
      return new ProductEntity(data);
    }

  }

  async remove(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productModel.findByIdAndDelete(id).lean();

    return new ProductEntity(product);
  }
}

