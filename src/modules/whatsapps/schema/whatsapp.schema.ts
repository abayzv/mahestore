import { Exclude, Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WhatsappDocument = HydratedDocument<Whatsapp>;

@Schema({ versionKey: false })
export class Whatsapp {

    @Prop()
    userId: string;

    @Prop()
    email: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    isActivated: boolean;

    @Prop()
    verify_code: string;

    @Prop()
    verify_token: string;

    @Prop()
    expires_in: number;

    constructor(partial: Partial<Whatsapp>) {
        Object.assign(this, partial)
    }
}

export const WhatsappSchema = SchemaFactory.createForClass(Whatsapp);