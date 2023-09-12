import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import { OrderItem } from './orderItem.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false })
export class Order {

    @Prop()
    customer_id: string;

    @Prop()
    reference_number: string;

    @Prop()
    date: Date;

    @Prop()
    status: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Address' })
    address_id: Types.ObjectId;

    @Prop()
    expedition_name: string;

    @Prop()
    expedition_fee: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'OrderItem' })
    order_items: OrderItem[];

    @Prop()
    total: number;

    constructor(partial: Partial<Order>) {
        Object.assign(this, partial)
    }
}

export const OrderSchema = SchemaFactory.createForClass(Order);