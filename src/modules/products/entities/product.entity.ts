import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId, Types } from 'mongoose';
import { MediaEntity } from 'src/modules/medias/entities/media.entity';

export const PRODUCT_SINGLE = 'product_single';
export const PRODUCT_LIST = 'product_list';

export class ProductEntity {

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    name: string;

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    price: number;

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    category: string;

    @Expose({ groups: [PRODUCT_SINGLE] })
    tags: string[];

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Expose({ groups: [PRODUCT_SINGLE] })
    description: string;

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST] })
    media_url: string;

    @Expose({ groups: [PRODUCT_SINGLE, PRODUCT_LIST], name: 'official_store' })
    @Transform(({ value }) => {

        if (!value) return null;

        return {
            name: value.name,
            picture_url: value.picture_url,
        }
    })
    official_store_id: Types.ObjectId;

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }
}
