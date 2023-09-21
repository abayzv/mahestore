import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOfficialStoreDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    picture_url: string;

    constructor(partial: Partial<CreateOfficialStoreDto>) {
        Object.assign(this, partial);
    }

}
