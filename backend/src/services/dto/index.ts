import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(1)
    duration: number;

    @IsNumber()
    @Min(0)
    price: number;
}

export class UpdateServiceDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    duration?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;
}
