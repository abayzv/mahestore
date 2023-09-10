import { IsNotEmpty, IsString } from "class-validator";

export class RevokeTokennDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

}