import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ versionKey: false })
export class Cart {

    @Prop()
    customer_id: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;

    @Prop()
    quantity: number;

    @Prop()
    unit_price: number;


    constructor(partial: Partial<Cart>) {
        Object.assign(this, partial)
    }
}

export const CartSchema = SchemaFactory.createForClass(Cart);