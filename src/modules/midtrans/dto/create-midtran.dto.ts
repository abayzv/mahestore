import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateMidtranDto {

    @IsNotEmpty()
    @IsString()
    order_id: string;

    @IsNotEmpty()
    @IsNumber()
    gross_amount: number;
}
