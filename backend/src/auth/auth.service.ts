import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { db } from '../database/database.module';
import { users } from '../database/schema';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    async register(dto: RegisterDto) {
        // Check if user already exists
        const existing = await db.select().from(users).where(eq(users.email, dto.email));
        if (existing.length > 0) {
            throw new ConflictException('Email is already registered');
        }

        // Create user (MVP: plain-text password. Use bcrypt in production)
        await db.insert(users).values({
            name: dto.name,
            email: dto.email,
            password: dto.password,
            role: dto.role || 'CUSTOMER',
        });

        return { message: 'User created successfully' };
    }

    async login(dto: LoginDto) {
        const result = await db.select().from(users).where(eq(users.email, dto.email));
        const user = result[0];

        if (!user || user.password !== dto.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, role: user.role, email: user.email, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async getProfile(userId: string) {
        const result = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
        }).from(users).where(eq(users.id, userId));

        if (result.length === 0) {
            throw new UnauthorizedException('User not found');
        }

        return result[0];
    }
}
