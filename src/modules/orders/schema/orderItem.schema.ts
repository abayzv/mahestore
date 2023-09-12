import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema({ versionKey: false })
export class OrderItem {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
    product_id: Types.ObjectId;

    @Prop()
    unit_price: number;

    @Prop()
    quantity: number;

    constructor(partial: Partial<OrderItem>) {
        Object.assign(this, partial)
    }
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);