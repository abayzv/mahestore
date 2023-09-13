import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop()
    media_url: string;

    @Prop()
    category: string;

    @Prop()
    tags: string[];

    constructor(partial: Partial<Product>) {
        Object.assign(this, partial)
    }
}

export const ProductSchema = SchemaFactory.createForClass(Product);