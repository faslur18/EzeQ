"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let ServicesService = class ServicesService {
    async verifySalonOwnership(salonId, adminId) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, salonId));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        if (salonArr[0].adminId !== adminId)
            throw new common_1.ForbiddenException('Not your salon');
        return salonArr[0];
    }
    async findAll(salonId) {
        return database_module_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId));
    }
    async findOne(salonId, serviceId) {
        const result = await database_module_1.db
            .select()
            .from(schema_1.services)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
        if (result.length === 0)
            throw new common_1.NotFoundException('Service not found');
        return result[0];
    }
    async create(salonId, adminId, dto) {
        await this.verifySalonOwnership(salonId, adminId);
        await database_module_1.db.insert(schema_1.services).values({
            salonId,
            name: dto.name.trim(),
            duration: dto.duration,
            price: dto.price,
        });
        return database_module_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId));
    }
    async update(salonId, serviceId, adminId, dto) {
        await this.verifySalonOwnership(salonId, adminId);
        const serviceArr = await database_module_1.db
            .select()
            .from(schema_1.services)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
        if (serviceArr.length === 0)
            throw new common_1.NotFoundException('Service not found');
        const updates = {};
        if (dto.name?.trim())
            updates.name = dto.name.trim();
        if (dto.duration !== undefined)
            updates.duration = dto.duration;
        if (dto.price !== undefined)
            updates.price = dto.price;
        if (Object.keys(updates).length === 0)
            return serviceArr[0];
        await database_module_1.db.update(schema_1.services).set(updates).where((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId));
        const updated = await database_module_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId));
        return updated[0];
    }
    async remove(salonId, serviceId, adminId) {
        await this.verifySalonOwnership(salonId, adminId);
        const serviceArr = await database_module_1.db
            .select()
            .from(schema_1.services)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
        if (serviceArr.length === 0)
            throw new common_1.NotFoundException('Service not found');
        await database_module_1.db.delete(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId));
        return { message: 'Service deleted' };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)()
], ServicesService);
//# sourceMappingURL=services.service.js.map