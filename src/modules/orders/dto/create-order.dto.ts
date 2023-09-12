import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';

class OrderItem {
    readonly product_id: string;
    readonly unit_price: number;
    readonly quantity: number;
}

export class CreateOrderDto {

    @IsNotEmpty()
    @IsArray()
    order_items: OrderItem[];

    @IsNotEmpty()
    @IsString()
    address_id: string;

    @IsNotEmpty()
    @IsString()
    expedition_name: string;

    @IsNotEmpty()
    @IsNumber()
    expedition_fee: number;

}
