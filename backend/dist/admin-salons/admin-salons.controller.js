"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSalonsController = void 0;
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
class AdminSalonsController {
    static async findAll(req, res) {
        try {
            const result = await db_1.db
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
            return res.json(result);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async updateStatus(req, res) {
        const id = req.params.id;
        const { status } = req.body;
        try {
            const salonArr = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            if (salonArr.length === 0)
                return res.status(404).json({ message: 'Salon not found' });
            if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
            await db_1.db
                .update(schema_1.salons)
                .set({ status, isActive: status === 'APPROVED' })
                .where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            const updated = await db_1.db.select().from(schema_1.salons).where((0, drizzle_orm_1.eq)(schema_1.salons.id, id));
            return res.json(updated[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.AdminSalonsController = AdminSalonsController;
//# sourceMappingURL=admin-salons.controller.js.map