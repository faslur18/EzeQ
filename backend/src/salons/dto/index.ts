import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSalonDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;
}

export class UpdateSalonDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;
}
