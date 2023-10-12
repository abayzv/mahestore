import { IsNotEmpty, IsNumber, IsString, MaxLength, IsEmail, IsOptional } from "class-validator";

export class AuthLoginDto {

    @IsNotEmpty()
    @IsOptional()
    @IsEmail()
    @MaxLength(50)
    email?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    password: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    phoneNumber?: number;
}