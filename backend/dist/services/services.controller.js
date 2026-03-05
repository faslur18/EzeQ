"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesController = void 0;
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ServicesController {
    static async verifySalonOwnership(salonId, adminId) {
        const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, salonId));
        if (salonArr.length === 0)
            throw new Error('NOT_FOUND');
        if (salonArr[0].adminId !== adminId)
            throw new Error('FORBIDDEN');
        return salonArr[0];
    }
    static async findAll(req, res) {
        const salonId = req.params.salonId;
        try {
            const result = await db_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId));
            return res.json(result);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async findOne(req, res) {
        const salonId = req.params.salonId;
        const id = req.params.id;
        try {
            const result = await db_1.db
                .select()
                .from(schema_1.services)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, id), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
            if (result.length === 0)
                return res.status(404).json({ message: 'Service not found' });
            return res.json(result[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async create(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId;
        const { name, duration, price } = req.body;
        try {
            await ServicesController.verifySalonOwnership(salonId, req.user.sub);
            await db_1.db.insert(schema_1.services).values({
                salonId,
                name: name.trim(),
                duration: parseInt(duration),
                price: parseFloat(price),
            });
            const allServices = await db_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId));
            return res.status(201).json(allServices);
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN')
                return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async update(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId;
        const id = req.params.id;
        const { name, duration, price } = req.body;
        try {
            await ServicesController.verifySalonOwnership(salonId, req.user.sub);
            const serviceArr = await db_1.db
                .select()
                .from(schema_1.services)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, id), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
            if (serviceArr.length === 0)
                return res.status(404).json({ message: 'Service not found' });
            const updates = {};
            if (name?.trim())
                updates.name = name.trim();
            if (duration !== undefined)
                updates.duration = parseInt(duration);
            if (price !== undefined)
                updates.price = parseFloat(price);
            if (Object.keys(updates).length > 0) {
                await db_1.db.update(schema_1.services).set(updates).where((0, drizzle_orm_1.eq)(schema_1.services.id, id));
            }
            const updated = await db_1.db.select().from(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, id));
            return res.json(updated[0]);
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN')
                return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async remove(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId;
        const id = req.params.id;
        try {
            await ServicesController.verifySalonOwnership(salonId, req.user.sub);
            const serviceArr = await db_1.db
                .select()
                .from(schema_1.services)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.services.id, id), (0, drizzle_orm_1.eq)(schema_1.services.salonId, salonId)));
            if (serviceArr.length === 0)
                return res.status(404).json({ message: 'Service not found' });
            await db_1.db.delete(schema_1.services).where((0, drizzle_orm_1.eq)(schema_1.services.id, id));
            return res.json({ message: 'Service deleted' });
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN')
                return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.ServicesController = ServicesController;
//# sourceMappingURL=services.controller.js.map