import { SetHoursDto, UpdateHourDto } from './dto';
export declare class HoursService {
    private verifySalonOwnership;
    findAll(salonId: string): Promise<{
        id: string;
        salonId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }[]>;
    setAll(salonId: string, adminId: string, dto: SetHoursDto): Promise<{
        id: string;
        salonId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }[]>;
    update(salonId: string, hourId: string, adminId: string, dto: UpdateHourDto): Promise<{
        id: string;
        salonId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }>;
    remove(salonId: string, hourId: string, adminId: string): Promise<{
        message: string;
    }>;
}
