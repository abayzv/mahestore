import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCartDto {

    @IsNotEmpty()
    @IsString()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    unit_price: number;

    constructor(partial: Partial<CreateCartDto>) {
        Object.assign(this, partial);
    }

}
