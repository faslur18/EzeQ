export declare class AdminSalonsService {
    findAll(): Promise<{
        id: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
        adminId: string;
        adminName: string | null;
        adminEmail: string | null;
    }[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        adminId: string;
        name: string;
        address: string;
        rating: number | null;
        isActive: boolean | null;
        status: string;
    }>;
}
