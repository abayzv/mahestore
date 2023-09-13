import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
export class AddressEntity {

    @Expose()
    name: string;

    @Expose()
    address: string;

    @Expose()
    city: string;

    @Expose()
    postcode: string;

    @Expose()
    province: string;

    @Expose()
    recipient_name: string;

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    constructor(partial: Partial<AddressEntity>) {
        Object.assign(this, partial);
    }

}
