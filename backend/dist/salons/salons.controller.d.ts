import { SalonsService } from './salons.service';
import { CreateSalonDto, UpdateSalonDto } from './dto';
export declare class SalonsController {
    private readonly salonsService;
    constructor(salonsService: SalonsService);
    findAll(): Promise<{
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }[]>;
    findMine(userId: string): Promise<{
        services: {
            id: string;
            salonId: string;
            name: string;
            duration: number;
            price: number;
        }[];
        operatingHours: {
            id: string;
            salonId: string;
            dayOfWeek: number;
            openTime: string;
            closeTime: string;
        }[];
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }>;
    findOne(id: string): Promise<{
        services: {
            id: string;
            salonId: string;
            name: string;
            duration: number;
            price: number;
        }[];
        operatingHours: {
            id: string;
            salonId: string;
            dayOfWeek: number;
            openTime: string;
            closeTime: string;
        }[];
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }>;
    create(userId: string, dto: CreateSalonDto): Promise<{
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }>;
    update(id: string, userId: string, dto: UpdateSalonDto): Promise<{
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
}
