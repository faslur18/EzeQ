import { CreateServiceDto, UpdateServiceDto } from './dto';
export declare class ServicesService {
    private verifySalonOwnership;
    findAll(salonId: string): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }[]>;
    findOne(salonId: string, serviceId: string): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }>;
    create(salonId: string, adminId: string, dto: CreateServiceDto): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }[]>;
    update(salonId: string, serviceId: string, adminId: string, dto: UpdateServiceDto): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }>;
    remove(salonId: string, serviceId: string, adminId: string): Promise<{
        message: string;
    }>;
}
