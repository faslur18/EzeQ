"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await database_module_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, dto.email));
        if (existing.length > 0) {
            throw new common_1.ConflictException('Email is already registered');
        }
        await database_module_1.db.insert(schema_1.users).values({
            name: dto.name,
            email: dto.email,
            password: dto.password,
            role: dto.role || 'CUSTOMER',
        });
        return { message: 'User created successfully' };
    }
    async login(dto) {
        const result = await database_module_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, dto.email));
        const user = result[0];
        if (!user || user.password !== dto.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async getProfile(userId) {
        const result = await database_module_1.db.select({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            role: schema_1.users.role,
            createdAt: schema_1.users.createdAt,
        }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (result.length === 0) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return result[0];
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map