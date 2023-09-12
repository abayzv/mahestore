import { Types } from "mongoose";

export interface ICreateOrderItem {
    order_id: Types.ObjectId;
    product_id: Types.ObjectId;
    unit_price: number;
    quantity: number;
}