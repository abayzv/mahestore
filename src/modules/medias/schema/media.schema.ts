import { Exclude, Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ versionKey: false })
export class Media {

    @Prop()
    path: string;

    constructor(partial: Partial<Media>) {
        Object.assign(this, partial)
    }
}

export const MediaSchema = SchemaFactory.createForClass(Media);