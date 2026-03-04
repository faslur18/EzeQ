"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSalonsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let AdminSalonsService = class AdminSalonsService {
    async findAll() {
        return database_module_1.db
            .select({
            id: schema_1.salons.id,
            name: schema_1.salons.name,
            address: schema_1.salons.address,
            rating: schema_1.salons.rating,
            isActive: schema_1.salons.isActive,
            status: schema_1.salons.status,
            adminId: schema_1.salons.adminId,
            adminName: schema_1.users.name,
            adminEmail: schema_1.users.email,
        })
            .from(schema_1.salons)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.salons.adminId, schema_1.users.id))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.salons.status));
    }
    async updateStatus(id, status) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            throw new common_1.NotFoundException('Invalid status');
        }
        await database_module_1.db
            .update(schema_1.salons)
            .set({ status, isActive: status === 'APPROVED' })
            .where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        const updated = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
        return updated[0];
    }
};
exports.AdminSalonsService = AdminSalonsService;
exports.AdminSalonsService = AdminSalonsService = __decorate([
    (0, common_1.Injectable)()
], AdminSalonsService);
//# sourceMappingURL=admin-salons.service.js.map