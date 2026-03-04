"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let SalonsService = class SalonsService {
    async findAll() {
        return database_module_1.db
            .select()
            .from(schema_1.salons)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.salons.status, 'APPROVED'), (0, drizzle_orm_1.eq)(schema_1.salons.isActive, true)))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.salons.rating));
    }
    async findOne(id) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        const salonServices = await database_module_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, id));
        const salonHours = await database_module_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, id));
        return {
            ...salonArr[0],
            services: salonServices,
            operatingHours: salonHours,
        };
    }
    async create(adminId, dto) {
        const existing = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, adminId));
        if (existing.length > 0) {
            throw new common_1.ConflictException('You already have a salon registered');
        }
        await database_module_1.db.insert(schema_1.salons).values({
            adminId,
            name: dto.name.trim(),
            address: dto.address.trim(),
            rating: 0,
            isActive: true,
            status: 'PENDING',
        });
        const created = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, adminId));
        return created[0];
    }
    async update(id, adminId, dto) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        if (salonArr[0].adminId !== adminId)
            throw new common_1.ForbiddenException('Not your salon');
        const updates = {};
        if (dto.name?.trim())
            updates.name = dto.name.trim();
        if (dto.address?.trim())
            updates.address = dto.address.trim();
        if (Object.keys(updates).length === 0)
            return salonArr[0];
        await database_module_1.db.update(schema_1.salons).set(updates).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        const updated = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        return updated[0];
    }
    async remove(id, userId, userRole) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        if (userRole === 'SALON_ADMIN' && salonArr[0].adminId !== userId) {
            throw new common_1.ForbiddenException('Not your salon');
        }
        await database_module_1.db.update(schema_1.salons).set({ isActive: false }).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        return { message: 'Salon deactivated' };
    }
};
exports.SalonsService = SalonsService;
exports.SalonsService = SalonsService = __decorate([
    (0, common_1.Injectable)()
], SalonsService);
//# sourceMappingURL=salons.service.js.map