import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsIn(['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'])
    role?: string;
}
