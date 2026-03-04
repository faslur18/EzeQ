"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let UsersService = class UsersService {
    async findAll() {
        return database_module_1.db
            .select({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            role: schema_1.users.role,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users);
    }
    async findOne(id) {
        const result = await database_module_1.db
            .select({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            role: schema_1.users.role,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (result.length === 0)
            throw new common_1.NotFoundException('User not found');
        return result[0];
    }
    async updateRole(id, currentUserId, role) {
        if (id === currentUserId)
            throw new common_1.BadRequestException('Cannot modify your own role');
        const userArr = await database_module_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (userArr.length === 0)
            throw new common_1.NotFoundException('User not found');
        if (!['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'].includes(role)) {
            throw new common_1.BadRequestException('Invalid role');
        }
        await database_module_1.db.update(schema_1.users).set({ role }).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return this.findOne(id);
    }
    async remove(id, currentUserId) {
        if (id === currentUserId)
            throw new common_1.BadRequestException('Cannot delete your own account');
        const userArr = await database_module_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (userArr.length === 0)
            throw new common_1.NotFoundException('User not found');
        await database_module_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return { message: 'User deleted' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map