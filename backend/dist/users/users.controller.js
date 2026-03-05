"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
class UsersController {
    static async findAll(req, res) {
        try {
            const result = await db_1.db
                .select({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                role: schema_1.users.role,
                createdAt: schema_1.users.createdAt,
            })
                .from(schema_1.users);
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
            const result = await db_1.db
                .select({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                role: schema_1.users.role,
                createdAt: schema_1.users.createdAt,
            })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            if (result.length === 0)
                return res.status(404).json({ message: 'User not found' });
            return res.json(result[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async updateRole(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id;
        const { role } = req.body;
        const currentUserId = req.user.sub;
        if (id === currentUserId)
            return res.status(400).json({ message: 'Cannot modify your own role' });
        try {
            const userArr = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            if (userArr.length === 0)
                return res.status(404).json({ message: 'User not found' });
            if (!['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'].includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            await db_1.db.update(schema_1.users).set({ role }).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            const updated = await db_1.db
                .select({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                role: schema_1.users.role,
                createdAt: schema_1.users.createdAt,
            })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
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
        const currentUserId = req.user.sub;
        if (id === currentUserId)
            return res.status(400).json({ message: 'Cannot delete your own account' });
        try {
            const userArr = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            if (userArr.length === 0)
                return res.status(404).json({ message: 'User not found' });
            await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
            return res.json({ message: 'User deleted' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map