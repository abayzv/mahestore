import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class MediaEntity {

    @Expose()
    path: string;

    @Exclude()
    _id: ObjectId;

    constructor(partial: Partial<MediaEntity>) {
        Object.assign(this, partial);
    }
}
