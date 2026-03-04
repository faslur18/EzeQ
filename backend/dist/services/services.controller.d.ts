import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(salonId: string): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }[]>;
    findOne(salonId: string, id: string): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }>;
    create(salonId: string, userId: string, dto: CreateServiceDto): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }[]>;
    update(salonId: string, id: string, userId: string, dto: UpdateServiceDto): Promise<{
        id: string;
        salonId: string;
        name: string;
        duration: number;
        price: number;
    }>;
    remove(salonId: string, id: string, userId: string): Promise<{
        message: string;
    }>;
}
