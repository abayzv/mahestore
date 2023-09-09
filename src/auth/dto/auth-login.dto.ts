import { IsNotEmpty, IsNumber, IsString, MaxLength, IsEmail } from "class-validator";

export class AuthLoginDto {

    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    password: string;
}