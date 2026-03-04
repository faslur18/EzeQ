import { HoursService } from './hours.service';
import { SetHoursDto, UpdateHourDto } from './dto';
export declare class HoursController {
    private readonly hoursService;
    constructor(hoursService: HoursService);
    findAll(salonId: string): Promise<{
        id: string;
        salonId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }[]>;
    setAll(salonId: string, userId: string, dto: SetHoursDto): Promise<{
        id: string;
        salonId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }[]>;
    update(salonId: string, id: string, userId: string, dto: UpdateHourDto): Promise<{
        id: string;
        salonId: string;
        dayOfWeek: number;
        openTime: string;
        closeTime: string;
    }>;
    remove(salonId: string, id: string, userId: string): Promise<{
        message: string;
    }>;
}
