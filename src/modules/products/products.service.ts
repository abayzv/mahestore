import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { IProduct } from './interface/product.interface';
import { ResponseError } from '../../common/error/error-exception';
import { ProductEntity } from './entities/product.entity';
import { MediasService } from '../medias/medias.service';
import { OfficialStore } from '../official-stores/entities/official-store.entity';
import { ProductQueryDto } from './dto/product-query.dto';
import { IPagination } from 'src/common/interface/pagination.interfaces';
import { PageEntity } from './entities/page.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private productModel: Model<IProduct>,
    private mediaService: MediasService,
    @InjectModel('OfficialStore') private officialStoreModel: Model<OfficialStore>,
  ) { }

  createProductQuery(filters: ProductQueryDto) {
    const query = {};

    if (filters.name) {
      query['name'] = { $regex: new RegExp(filters.name, 'i') };
    }
    if (filters.category) {
      query['category'] = filters.category;
    }
    if (filters.tags && filters.tags.length > 0) {
      query['tags'] = { $in: filters.tags };
    }

    return query;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {

    const isExist = await this.productModel.findOne({ name: createProductDto.name });

    if (isExist) {
      throw new ResponseError(400, 'Product already exist')
    }

    if (createProductDto.official_store_id) {
      const officialStore = await this.officialStoreModel.findById(createProductDto.official_store_id);

      if (!officialStore) throw new ResponseError(400, 'Official store not found');
    }

    let media_url = '';

    if (createProductDto.media_id !== '0') {
      const media = await this.mediaService.findOne(createProductDto.media_id);

      if (!media) throw new ResponseError(400, 'Media not found');

      media_url = media.path;
    } else {
      media_url = createProductDto.media_url;
    }

    const product = await this.productModel.create({ ...createProductDto, media_url: media_url });
    const result = await this.productModel.findById(product._id).lean().populate('official_store_id');

    return new ProductEntity(result);
  }

  async findAll(query: ProductQueryDto): Promise<PageEntity> {

    const { limit, page, ...filter } = query;
    const queryFilter = this.createProductQuery(filter);

    const products: ProductEntity[] = await this.productModel.find(queryFilter).limit(limit).skip((page - 1) * limit).lean().populate('official_store_id');

    const response = products.map(product => new ProductEntity(product));

    const pagination: IPagination = {
      page: page,
      pageSize: limit,
      totalPages: Math.ceil(await this.productModel.countDocuments(filter) / limit),
      totalRecords: await this.productModel.countDocuments(filter)
    }

    return new PageEntity(pagination, response);
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productModel.findById(id).lean().populate('official_store_id');
    return new ProductEntity(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {

    let data = new this.productModel();

    if (updateProductDto.official_store_id) {
      const officialStore = await this.officialStoreModel.findById(updateProductDto.official_store_id);

      if (!officialStore) throw new ResponseError(400, 'Official store not found');

      data = await this.productModel.findByIdAndUpdate(id, { ...updateProductDto, official_store_id: officialStore._id }, { new: true }).lean().populate('official_store_id');
    }

    if (updateProductDto.media_id) {
      const media = await this.mediaService.findOne(updateProductDto.media_id);

      data = await this.productModel.findByIdAndUpdate(id, { ...updateProductDto, media_url: media.path }, { new: true }).lean().populate('official_store_id');
    } else {
      data = await this.productModel.findByIdAndUpdate(id, { ...updateProductDto }, { new: true }).lean().populate('official_store_id');
    }

    return new ProductEntity(data);
  }

  async assignOfficialStore(id: string, officialStoreId: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productModel.findByIdAndUpdate(id, { official_store_id: officialStoreId }, { new: true }).lean();
    return new ProductEntity(product);
  }

  async remove(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productModel.findByIdAndDelete(id).lean();

    return new ProductEntity(product);
  }
}

