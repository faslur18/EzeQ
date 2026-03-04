export declare class UsersService {
    findAll(): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    updateRole(id: string, currentUserId: string, role: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    remove(id: string, currentUserId: string): Promise<{
        message: string;
    }>;
}
