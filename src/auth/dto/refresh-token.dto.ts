import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokennDto {

    @IsNotEmpty()
    @IsString()
    refreshToken: string;

}