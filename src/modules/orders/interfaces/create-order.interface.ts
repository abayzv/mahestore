import { Types } from "mongoose";

export interface ICreateOrder {
    customer_id: string;
    reference_number: string;
    date: Date;
    status: string;
    address_id: Types.ObjectId;
    expedition_name: string;
    expedition_fee: number;
    total: number;
}