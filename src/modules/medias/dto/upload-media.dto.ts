import { IsMimeType, IsNotEmpty } from "class-validator";

export class UploadMediaDto {

    @IsNotEmpty()
    @IsMimeType()
    file: any;

}