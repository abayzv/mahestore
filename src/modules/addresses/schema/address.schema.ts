import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ versionKey: false })
export class Address {

    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    city: string;

    @Prop()
    postcode: string;

    @Prop()
    province: string;

    @Prop()
    recipient_name: string;

    constructor(partial: Partial<Address>) {
        Object.assign(this, partial)
    }
}

export const AddressSchema = SchemaFactory.createForClass(Address);