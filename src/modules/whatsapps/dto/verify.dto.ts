import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class VerifyDto {
    @IsNumber()
    @IsNotEmpty()
    verify_code: number;

    @IsString()
    @IsNotEmpty()
    verify_token: string;
}