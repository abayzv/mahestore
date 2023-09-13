import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

export class OrderItemEntity {

    @Expose()
    quantity: number;

    @Expose()
    price: number;

    @Expose()
    total: number;

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Expose({ name: 'product' })
    @Transform(({ value }) => {
        const product = new ProductEntity(value);
        return {
            name: product.name,
            description: product.description,
            media: product.media_url
        }
    })
    product_id: ProductEntity;

    constructor(partial: Partial<OrderItemEntity>) {
        Object.assign(this, partial);
    }

}
