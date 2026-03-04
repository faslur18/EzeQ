"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const database_module_1 = require("../database/database.module");
const schema_1 = require("../database/schema");
let AppointmentsService = class AppointmentsService {
    async findAll(userId, userRole) {
        if (userRole === 'CUSTOMER') {
            return database_module_1.db
                .select()
                .from(schema_1.appointments)
                .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                .leftJoin(schema_1.salons, (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, schema_1.salons.id))
                .where((0, drizzle_orm_1.eq)(schema_1.appointments.customerId, userId))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.appointments.createdAt));
        }
        if (userRole === 'SALON_ADMIN') {
            const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
            if (salonArr.length === 0)
                return [];
            return database_module_1.db
                .select()
                .from(schema_1.appointments)
                .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.appointments.customerId, schema_1.users.id))
                .where((0, drizzle_orm_1.eq)(schema_1.appointments.salonId, salonArr[0].id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.appointments.createdAt));
        }
        if (userRole === 'SUPER_ADMIN') {
            return database_module_1.db
                .select()
                .from(schema_1.appointments)
                .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                .leftJoin(schema_1.salons, (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, schema_1.salons.id))
                .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.appointments.customerId, schema_1.users.id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.appointments.createdAt));
        }
        return [];
    }
    async findOne(id, userId, userRole) {
        const result = await database_module_1.db
            .select()
            .from(schema_1.appointments)
            .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
            .leftJoin(schema_1.salons, (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, schema_1.salons.id))
            .where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
        if (result.length === 0)
            throw new common_1.NotFoundException('Appointment not found');
        const appt = result[0];
        if (userRole === 'CUSTOMER' && appt.appointments.customerId !== userId) {
            throw new common_1.ForbiddenException('Not your appointment');
        }
        if (userRole === 'SALON_ADMIN') {
            const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
            if (salonArr.length === 0 || appt.appointments.salonId !== salonArr[0].id) {
                throw new common_1.ForbiddenException('Not your salon\'s appointment');
            }
        }
        return appt;
    }
    async create(customerId, dto) {
        const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, dto.salonId));
        if (salonArr.length === 0)
            throw new common_1.NotFoundException('Salon not found');
        if (!salonArr[0].isActive || salonArr[0].status !== 'APPROVED') {
            throw new common_1.BadRequestException('Salon is not available for bookings');
        }
        const serviceArr = await database_module_1.db
            .select()
            .from(schema_1.services)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, dto.serviceId), (0, drizzle_orm_1.eq)(schema_1.services.salonId, dto.salonId)));
        if (serviceArr.length === 0)
            throw new common_1.NotFoundException('Service not found for this salon');
        const existingAppts = await database_module_1.db
            .select()
            .from(schema_1.appointments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointments.salonId, dto.salonId), (0, drizzle_orm_1.eq)(schema_1.appointments.appointmentDate, dto.date), (0, drizzle_orm_1.eq)(schema_1.appointments.startTime, dto.startTime), (0, drizzle_orm_1.ne)(schema_1.appointments.status, 'CANCELLED')));
        if (existingAppts.length > 0) {
            throw new common_1.ConflictException('Time slot is no longer available');
        }
        await database_module_1.db.insert(schema_1.appointments).values({
            customerId,
            salonId: dto.salonId,
            serviceId: dto.serviceId,
            appointmentDate: dto.date,
            startTime: dto.startTime,
            status: 'CONFIRMED',
        });
        const created = await database_module_1.db
            .select()
            .from(schema_1.appointments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointments.customerId, customerId), (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, dto.salonId), (0, drizzle_orm_1.eq)(schema_1.appointments.appointmentDate, dto.date), (0, drizzle_orm_1.eq)(schema_1.appointments.startTime, dto.startTime)));
        return created[0];
    }
    async updateStatus(id, userId, userRole, dto) {
        const apptArr = await database_module_1.db.select().from(schema_1.appointments).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
        if (apptArr.length === 0)
            throw new common_1.NotFoundException('Appointment not found');
        const appt = apptArr[0];
        if (userRole === 'CUSTOMER') {
            if (appt.customerId !== userId)
                throw new common_1.ForbiddenException('Not your appointment');
            if (dto.status !== 'CANCELLED')
                throw new common_1.ForbiddenException('Customers can only cancel');
        }
        else if (userRole === 'SALON_ADMIN') {
            const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
            if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                throw new common_1.ForbiddenException('Not your salon\'s appointment');
            }
        }
        await database_module_1.db.update(schema_1.appointments).set({ status: dto.status }).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
        const updated = await database_module_1.db.select().from(schema_1.appointments).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
        return updated[0];
    }
    async remove(id, userId, userRole) {
        const apptArr = await database_module_1.db.select().from(schema_1.appointments).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
        if (apptArr.length === 0)
            throw new common_1.NotFoundException('Appointment not found');
        const appt = apptArr[0];
        if (userRole === 'CUSTOMER' && appt.customerId !== userId) {
            throw new common_1.ForbiddenException('Not your appointment');
        }
        if (userRole === 'SALON_ADMIN') {
            const salonArr = await database_module_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
            if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                throw new common_1.ForbiddenException('Not your salon\'s appointment');
            }
        }
        await database_module_1.db.update(schema_1.appointments).set({ status: 'CANCELLED' }).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
        return { message: 'Appointment cancelled' };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)()
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map