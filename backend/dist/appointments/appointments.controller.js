"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
class AppointmentsController {
    static async findAll(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const { sub: userId, role: userRole } = req.user;
        try {
            if (userRole === 'CUSTOMER') {
                const result = await db_1.db
                    .select({
                    appointments: schema_1.appointments,
                    service: schema_1.services,
                    salon: schema_1.salons
                })
                    .from(schema_1.appointments)
                    .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                    .leftJoin(schema_1.salons, (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, schema_1.salons.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.appointments.customerId, userId))
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.appointments.createdAt));
                return res.json(result);
            }
            if (userRole === 'SALON_ADMIN') {
                const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
                if (salonArr.length === 0)
                    return res.json([]);
                const result = await db_1.db
                    .select({
                    appointments: schema_1.appointments,
                    service: schema_1.services,
                    customer: schema_1.users
                })
                    .from(schema_1.appointments)
                    .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                    .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.appointments.customerId, schema_1.users.id))
                    .where((0, drizzle_orm_1.eq)(schema_1.appointments.salonId, salonArr[0].id))
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.appointments.createdAt));
                return res.json(result);
            }
            if (userRole === 'SUPER_ADMIN') {
                const result = await db_1.db
                    .select({
                    appointments: schema_1.appointments,
                    service: schema_1.services,
                    salon: schema_1.salons,
                    customer: schema_1.users
                })
                    .from(schema_1.appointments)
                    .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                    .leftJoin(schema_1.salons, (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, schema_1.salons.id))
                    .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.appointments.customerId, schema_1.users.id))
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.appointments.createdAt));
                return res.json(result);
            }
            return res.status(403).json({ message: 'Forbidden' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async findOne(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id;
        const { sub: userId, role: userRole } = req.user;
        try {
            const result = await db_1.db
                .select({
                appointments: schema_1.appointments,
                service: schema_1.services,
                salon: schema_1.salons
            })
                .from(schema_1.appointments)
                .leftJoin(schema_1.services, (0, drizzle_orm_1.eq)(schema_1.appointments.serviceId, schema_1.services.id))
                .leftJoin(schema_1.salons, (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, schema_1.salons.id))
                .where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
            if (result.length === 0)
                return res.status(404).json({ message: 'Appointment not found' });
            const appt = result[0];
            if (userRole === 'CUSTOMER' && appt.appointments.customerId !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            if (userRole === 'SALON_ADMIN') {
                const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
                if (salonArr.length === 0 || appt.appointments.salonId !== salonArr[0].id) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }
            return res.json(appt);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async create(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const { salonId, serviceId, date, startTime } = req.body;
        try {
            const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, salonId));
            if (salonArr.length === 0)
                return res.status(404).json({ message: 'Salon not found' });
            if (!salonArr[0].isActive || salonArr[0].status !== 'APPROVED') {
                return res.status(400).json({ message: 'Salon is not available for bookings' });
            }
            const serviceArr = await db_1.db
                .select()
                .from(schema_1.services)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, serviceId), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
            if (serviceArr.length === 0)
                return res.status(404).json({ message: 'Service not found for this salon' });
            const existingAppts = await db_1.db
                .select()
                .from(schema_1.appointments)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointments.salonId, salonId), (0, drizzle_orm_1.eq)(schema_1.appointments.appointmentDate, date), (0, drizzle_orm_1.eq)(schema_1.appointments.startTime, startTime), (0, drizzle_orm_1.ne)(schema_1.appointments.status, 'CANCELLED')));
            if (existingAppts.length > 0) {
                return res.status(409).json({ message: 'Time slot is no longer available' });
            }
            await db_1.db.insert(schema_1.appointments).values({
                customerId: req.user.sub,
                salonId,
                serviceId,
                appointmentDate: date,
                startTime,
                status: 'CONFIRMED',
            });
            const created = await db_1.db
                .select()
                .from(schema_1.appointments)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.appointments.customerId, req.user.sub), (0, drizzle_orm_1.eq)(schema_1.appointments.salonId, salonId), (0, drizzle_orm_1.eq)(schema_1.appointments.appointmentDate, date), (0, drizzle_orm_1.eq)(schema_1.appointments.startTime, startTime)));
            return res.status(201).json(created[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async updateStatus(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id;
        const { status } = req.body;
        const { sub: userId, role: userRole } = req.user;
        try {
            const apptArr = await db_1.db.select().from(schema_1.appointments).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
            if (apptArr.length === 0)
                return res.status(404).json({ message: 'Appointment not found' });
            const appt = apptArr[0];
            if (userRole === 'CUSTOMER') {
                if (appt.customerId !== userId)
                    return res.status(403).json({ message: 'Forbidden' });
                if (status !== 'CANCELLED')
                    return res.status(403).json({ message: 'Customers can only cancel' });
            }
            else if (userRole === 'SALON_ADMIN') {
                const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
                if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }
            await db_1.db.update(schema_1.appointments).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
            const updated = await db_1.db.select().from(schema_1.appointments).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
            return res.json(updated[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async remove(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id;
        const { sub: userId, role: userRole } = req.user;
        try {
            const apptArr = await db_1.db.select().from(schema_1.appointments).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
            if (apptArr.length === 0)
                return res.status(404).json({ message: 'Appointment not found' });
            const appt = apptArr[0];
            if (userRole === 'CUSTOMER' && appt.customerId !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            if (userRole === 'SALON_ADMIN') {
                const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, userId));
                if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }
            await db_1.db.update(schema_1.appointments).set({ status: 'CANCELLED' }).where((0, drizzle_orm_1.eq)(schema_1.appointments.id, id));
            return res.json({ message: 'Appointment cancelled' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.AppointmentsController = AppointmentsController;
//# sourceMappingURL=appointments.controller.js.map