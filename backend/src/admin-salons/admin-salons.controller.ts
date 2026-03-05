import { Response } from 'express';
import { db } from '../database/db';
import { salons, users } from '../database/schema';
import { eq, asc } from 'drizzle-orm';

export class AdminSalonsController {
    static async findAll(req: any, res: Response) {
        try {
            const result = await db
                .select({
                    id: salons.id,
                    name: salons.name,
                    address: salons.address,
                    rating: salons.rating,
                    isActive: salons.isActive,
                    status: salons.status,
                    adminId: salons.adminId,
                    adminName: users.name,
                    adminEmail: users.email,
                })
                .from(salons)
                .leftJoin(users, eq(salons.adminId, users.id))
                .orderBy(asc(salons.status));
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updateStatus(req: any, res: Response) {
        const id = req.params.id as string;
        const { status } = req.body;

        try {
            const salonArr = await db.select().from(salons).where(eq(salons.id, id));
            if (salonArr.length === 0) return res.status(404).json({ message: 'Salon not found' });

            if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            await db
                .update(salons)
                .set({ status, isActive: status === 'APPROVED' })
                .where(eq(salons.id, id));

            const updated = await db.select().from(salons).where(eq(salons.id, id));
            return res.json(updated[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
