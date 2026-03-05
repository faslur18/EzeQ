import { Response } from 'express';
import { db } from '../database/db';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export class UsersController {
    static async findAll(req: any, res: Response) {
        try {
            const result = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users);
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async findOne(req: any, res: Response) {
        const id = req.params.id as string;
        try {
            const result = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users)
                .where(eq(users.id, id));

            if (result.length === 0) return res.status(404).json({ message: 'User not found' });
            return res.json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updateRole(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const { role } = req.body;
        const currentUserId = req.user!.sub;

        if (id === currentUserId) return res.status(400).json({ message: 'Cannot modify your own role' });

        try {
            const userArr = await db.select().from(users).where(eq(users.id, id));
            if (userArr.length === 0) return res.status(404).json({ message: 'User not found' });

            if (!['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'].includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            await db.update(users).set({ role }).where(eq(users.id, id));
            const updated = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    createdAt: users.createdAt,
                })
                .from(users)
                .where(eq(users.id, id));

            return res.json(updated[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async remove(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const currentUserId = req.user!.sub;

        if (id === currentUserId) return res.status(400).json({ message: 'Cannot delete your own account' });

        try {
            const userArr = await db.select().from(users).where(eq(users.id, id));
            if (userArr.length === 0) return res.status(404).json({ message: 'User not found' });

            await db.delete(users).where(eq(users.id, id));
            return res.json({ message: 'User deleted' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
