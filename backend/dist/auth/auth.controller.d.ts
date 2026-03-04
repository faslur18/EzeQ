import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
