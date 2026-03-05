"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursController = void 0;
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
class HoursController {
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
            const result = await db_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId));
            return res.json(result);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async setAll(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId;
        const { hours } = req.body;
        try {
            await HoursController.verifySalonOwnership(salonId, req.user.sub);
            await db_1.db.delete(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId));
            if (hours && hours.length > 0) {
                await db_1.db.insert(schema_1.operatingHours).values(hours.map((h) => ({
                    salonId,
                    dayOfWeek: h.dayOfWeek,
                    openTime: h.openTime,
                    closeTime: h.closeTime,
                })));
            }
            const result = await db_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId));
            return res.json(result);
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
        const { openTime, closeTime, dayOfWeek } = req.body;
        try {
            await HoursController.verifySalonOwnership(salonId, req.user.sub);
            const hourArr = await db_1.db
                .select()
                .from(schema_1.operatingHours)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, id), (0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId)));
            if (hourArr.length === 0)
                return res.status(404).json({ message: 'Operating hour not found' });
            const updates = {};
            if (openTime)
                updates.openTime = openTime;
            if (closeTime)
                updates.closeTime = closeTime;
            if (dayOfWeek !== undefined)
                updates.dayOfWeek = dayOfWeek;
            if (Object.keys(updates).length > 0) {
                await db_1.db.update(schema_1.operatingHours).set(updates).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, id));
            }
            const updated = await db_1.db.select().from(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, id));
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
            await HoursController.verifySalonOwnership(salonId, req.user.sub);
            const hourArr = await db_1.db
                .select()
                .from(schema_1.operatingHours)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, id), (0, drizzle_orm_1.eq)(schema_1.operatingHours.salonId, salonId)));
            if (hourArr.length === 0)
                return res.status(404).json({ message: 'Operating hour not found' });
            await db_1.db.delete(schema_1.operatingHours).where((0, drizzle_orm_1.eq)(schema_1.operatingHours.id, id));
            return res.json({ message: 'Operating hour deleted' });
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
exports.HoursController = HoursController;
//# sourceMappingURL=hours.controller.js.map