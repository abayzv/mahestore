import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export const PRODUCT_SINGLE = 'product_single';
export const PRODUCT_LIST = 'product_list';

export class ProductEntity {

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    name: string;

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    price: number;

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    category: string;

    @Expose({ groups: [PRODUCT_SINGLE] })
    tags: string[];

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Expose({ groups: [PRODUCT_SINGLE] })
    description: string;

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }
}
