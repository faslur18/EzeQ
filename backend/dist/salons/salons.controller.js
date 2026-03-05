"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalonsController = void 0;
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
class SalonsController {
    static async findAll(req, res) {
        try {
            const result = await db_1.db
                .select()
                .from(schema_1.salons)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.salons.status, 'APPROVED'), (0, drizzle_orm_1.eq)(schema_1.salons.isActive, true)))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.salons.rating));
            return res.json(result);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async findOne(req, res) {
        const id = req.params.id;
        try {
            const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            if (salonArr.length === 0)
                return res.status(404).json({ message: 'Salon not found' });
            const salonServices = await db_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, id));
            const salonHours = await db_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, id));
            return res.json({
                ...salonArr[0],
                services: salonServices,
                operatingHours: salonHours,
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async findMySalon(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        try {
            const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, req.user.sub));
            if (salonArr.length === 0)
                return res.status(404).json({ message: 'Salon not found' });
            const salonServices = await db_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, salonArr[0].id));
            const salonHours = await db_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonArr[0].id));
            return res.json({
                ...salonArr[0],
                services: salonServices,
                operatingHours: salonHours,
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async create(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const { name, address } = req.body;
        try {
            const user = req.user;
            const existing = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, user.sub));
            if (existing.length > 0) {
                return res.status(409).json({ message: 'You already have a salon registered' });
            }
            await db_1.db.insert(schema_1.salons).values({
                adminId: user.sub,
                name: name.trim(),
                address: address.trim(),
                rating: 0,
                isActive: true,
                status: 'PENDING',
            });
            const created = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.adminId, user.sub));
            return res.status(201).json(created[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async update(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id;
        const { name, address } = req.body;
        const user = req.user;
        try {
            const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            if (salonArr.length === 0)
                return res.status(404).json({ message: 'Salon not found' });
            if (user.role !== 'SUPER_ADMIN' && salonArr[0].adminId !== user.sub) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const updates = {};
            if (name?.trim())
                updates.name = name.trim();
            if (address?.trim())
                updates.address = address.trim();
            if (Object.keys(updates).length > 0) {
                await db_1.db.update(schema_1.salons).set(updates).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            }
            const updated = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
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
        const user = req.user;
        try {
            const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            if (salonArr.length === 0)
                return res.status(404).json({ message: 'Salon not found' });
            if (user.role !== 'SUPER_ADMIN' && salonArr[0].adminId !== user.sub) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            await db_1.db.update(schema_1.salons).set({ isActive: false }).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            return res.json({ message: 'Salon deactivated' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.SalonsController = SalonsController;
//# sourceMappingURL=salons.controller.js.map