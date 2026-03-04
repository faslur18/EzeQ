"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let HoursService = class HoursService {
    async verifySalonOwnership(salonId, adminId) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, salonId));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        if (salonArr[0].adminId !== adminId)
            throw new common_1.ForbiddenException('Not your salon');
        return salonArr[0];
    }
    async findAll(salonId) {
        return database_module_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId));
    }
    async setAll(salonId, adminId, dto) {
        await this.verifySalonOwnership(salonId, adminId);
        await database_module_1.db.delete(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId));
        if (dto.hours.length > 0) {
            await database_module_1.db.insert(schema_1.operatingHours).values(dto.hours.map((h) => ({
                salonId,
                dayOfWeek: h.dayOfWeek,
                openTime: h.openTime,
                closeTime: h.closeTime,
            })));
        }
        return database_module_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId));
    }
    async update(salonId, hourId, adminId, dto) {
        await this.verifySalonOwnership(salonId, adminId);
        const hourArr = await database_module_1.db
            .select()
            .from(schema_1.operatingHours)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, hourId), (0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId)));
        if (hourArr.length === 0)
            throw new common_1.NotFoundException('Operating hour not found');
        const updates = {};
        if (dto.openTime)
            updates.openTime = dto.openTime;
        if (dto.closeTime)
            updates.closeTime = dto.closeTime;
        if (dto.dayOfWeek !== undefined)
            updates.dayOfWeek = dto.dayOfWeek;
        if (Object.keys(updates).length === 0)
            return hourArr[0];
        await database_module_1.db.update(schema_1.operatingHours).set(updates).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, hourId));
        const updated = await database_module_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, hourId));
        return updated[0];
    }
    async remove(salonId, hourId, adminId) {
        await this.verifySalonOwnership(salonId, adminId);
        const hourArr = await database_module_1.db
            .select()
            .from(schema_1.operatingHours)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, hourId), (0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId)));
        if (hourArr.length === 0)
            throw new common_1.NotFoundException('Operating hour not found');
        await database_module_1.db.delete(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, hourId));
        return { message: 'Operating hour deleted' };
    }
};
exports.HoursService = HoursService;
exports.HoursService = HoursService = __decorate([
    (0, common_1.Injectable)()
], HoursService);
//# sourceMappingURL=hours.service.js.map