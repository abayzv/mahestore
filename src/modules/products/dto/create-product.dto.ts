import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    category: string;

    @IsNotEmpty()
    @IsString({ each: true })
    tags: string[];
}
