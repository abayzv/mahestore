import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class ProductEntity {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Exclude()
    description: string;

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }
}
