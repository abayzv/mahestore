import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type OfficialStoreDocument = HydratedDocument<OfficialStore>;

@Schema({ versionKey: false })
export class OfficialStore {

    @Prop()
    name: string;

    @Prop()
    picture_url: string;

    @Prop([{ type: MongooseSchema.Types.Number }])
    followers: number[];

    constructor(partial: Partial<OfficialStore>) {
        Object.assign(this, partial)
    }
}

export const OfficialStoreSchema = SchemaFactory.createForClass(OfficialStore);