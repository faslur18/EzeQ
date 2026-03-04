import { IsNumber, IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class HourEntryDto {
    @IsNumber()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @IsString()
    @IsNotEmpty()
    openTime: string;

    @IsString()
    @IsNotEmpty()
    closeTime: string;
}

export class SetHoursDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HourEntryDto)
    hours: HourEntryDto[];
}

export class UpdateHourDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(6)
    dayOfWeek?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    openTime?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    closeTime?: string;
}
