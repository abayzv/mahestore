import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { IsObjectId } from "src/common/decorator/IsObjectId.decorator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    description: string;

    @IsObjectId({
        message: 'official_store_id must be an ObjectId'
    })
    @IsNotEmpty()
    @IsString()
    official_store_id: string;

    @IsNotEmpty({
        message: 'If want to use image from url, leave this field to 0'
    })
    @IsString()
    @ApiProperty({ default: '0' })
    media_id: string = '0';

    @IsString()
    media_url: string;

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
