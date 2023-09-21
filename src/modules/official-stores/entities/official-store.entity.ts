import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class OfficialStore {

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Expose()
    name: string;

    @Expose()
    picture_url: string;

    @Expose()
    followers: number[];

    constructor(partial: Partial<OfficialStore>) {
        Object.assign(this, partial)
    }

}
