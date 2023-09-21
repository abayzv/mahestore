import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

export class CartEntity {

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

    @Expose()
    quantity: number;

    @Expose()
    unit_price: number;

    @Exclude()
    customer_id: string;

    constructor(partial: Partial<CartEntity>) {
        Object.assign(this, partial);
    }

}
