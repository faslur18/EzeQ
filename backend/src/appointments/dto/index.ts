import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateAppointmentDto {
    @IsString()
    @IsNotEmpty()
    salonId: string;

    @IsString()
    @IsNotEmpty()
    serviceId: string;

    @IsString()
    @IsNotEmpty()
    date: string; // YYYY-MM-DD

    @IsString()
    @IsNotEmpty()
    startTime: string; // HH:mm
}

export class UpdateAppointmentStatusDto {
    @IsString()
    @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED'])
    status: string;
}
