import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductEntity } from './entities/product.entity';

describe('ProductController', () => {
  let productsService: ProductsService;
  let productsController: ProductsController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productModel: Model<Product>;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    productModel = mongoConnection.model('Product', ProductSchema);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: productModel,
        }
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    mongoConnection.close();
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  it('should create a product', async () => {

    const product = {
      name: 'Product 1',
      description: 'Description 1',
      price: 1,
      category: 'Category 1',
      tags: ['Tag 1']
    }

    const result = await productsController.create(product);

    expect(result.name).toEqual("Product 1");
    expect(result.description).toEqual("Description 1");
    expect(result.price).toEqual(1);
    expect(result.category).toEqual("Category 1");
    expect(result.tags).toEqual(["Tag 1"]);
  });
});
