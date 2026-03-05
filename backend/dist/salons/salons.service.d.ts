import { CreateSalonDto, UpdateSalonDto } from './dto';
export declare class SalonsService {
    findAll(): Promise<{
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }[]>;
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
    findMySalon(adminId: string): Promise<{
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
    create(adminId: string, dto: CreateSalonDto): Promise<{
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }>;
    update(id: string, adminId: string, dto: UpdateSalonDto): Promise<{
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
