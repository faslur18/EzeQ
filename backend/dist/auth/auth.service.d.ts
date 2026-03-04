import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string | null;
            email: string;
            role: string;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        role: string;
        createdAt: Date;
    }>;
}
