import { Exclude, Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
    category: string;

    @Prop()
    tags: string[];

    constructor(partial: Partial<Product>) {
        Object.assign(this, partial)
    }
}

export const ProductSchema = SchemaFactory.createForClass(Product);