import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { OrderItem } from '../schema/orderItem.schema';
import { AddressEntity } from 'src/modules/addresses/entities/address.entity';
import { OrderItemEntity } from './orderItem.entity';

export const ORDER_SINGLE = 'order_single';
export const ORDER_LIST = 'order_list';

export class OrderEntity {

    @Expose({ groups: [ORDER_SINGLE, ORDER_LIST] })
    reference_number: string;

    @Expose({ groups: [ORDER_SINGLE, ORDER_LIST] })
    status: string;

    @Expose({ groups: [ORDER_SINGLE, ORDER_LIST] })
    date: Date;

    @Expose({ groups: [ORDER_SINGLE, ORDER_LIST] })
    total: number;

    @Expose({ groups: [ORDER_SINGLE] })
    expedition_name: string;

    @Expose({ groups: [ORDER_SINGLE] })
    expedition_fee: number;

    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Expose({ groups: [ORDER_SINGLE] })
    @Transform(({ value }) => new AddressEntity(value))
    address_id: AddressEntity;

    @Exclude()
    order_items: OrderItemEntity[];

    @Exclude()
    customer_id: string;


    constructor(partial: Partial<OrderEntity>) {
        Object.assign(this, partial);
    }

}
