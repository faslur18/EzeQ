import { Response } from 'express';
import { db } from '../database/db';
import { salons, operatingHours } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export class HoursController {
    private static async verifySalonOwnership(salonId: string, adminId: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId));
        if (salonArr.length === 0) throw new Error('NOT_FOUND');
        if (salonArr[0].adminId !== adminId) throw new Error('FORBIDDEN');
        return salonArr[0];
    }

    static async findAll(req: any, res: Response) {
        const salonId = req.params.salonId as string;
        try {
            const result = await db.select().from(operatingHours).where(eq(operatingHours.salonId, salonId));
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async setAll(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId as string;
        const { hours } = req.body; // Array of { dayOfWeek, openTime, closeTime }

        try {
            await HoursController.verifySalonOwnership(salonId, req.user!.sub);

            // Delete existing and replace
            await db.delete(operatingHours).where(eq(operatingHours.salonId, salonId));

            if (hours && hours.length > 0) {
                await db.insert(operatingHours).values(
                    hours.map((h: any) => ({
                        salonId,
                        dayOfWeek: h.dayOfWeek,
                        openTime: h.openTime,
                        closeTime: h.closeTime,
                    })),
                );
            }

            const result = await db.select().from(operatingHours).where(eq(operatingHours.salonId, salonId));
            return res.json(result);
        } catch (err: any) {
            if (err.message === 'NOT_FOUND') return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN') return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async update(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId as string;
        const id = req.params.id as string;
        const { openTime, closeTime, dayOfWeek } = req.body;

        try {
            await HoursController.verifySalonOwnership(salonId, req.user!.sub);

            const hourArr = await db
                .select()
                .from(operatingHours)
                .where(and(eq(operatingHours.id, id), eq(operatingHours.salonId, salonId)));
            if (hourArr.length === 0) return res.status(404).json({ message: 'Operating hour not found' });

            const updates: Record<string, any> = {};
            if (openTime) updates.openTime = openTime;
            if (closeTime) updates.closeTime = closeTime;
            if (dayOfWeek !== undefined) updates.dayOfWeek = dayOfWeek;

            if (Object.keys(updates).length > 0) {
                await db.update(operatingHours).set(updates).where(eq(operatingHours.id, id));
            }

            const updated = await db.select().from(operatingHours).where(eq(operatingHours.id, id));
            return res.json(updated[0]);
        } catch (err: any) {
            if (err.message === 'NOT_FOUND') return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN') return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async remove(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId as string;
        const id = req.params.id as string;

        try {
            await HoursController.verifySalonOwnership(salonId, req.user!.sub);

            const hourArr = await db
                .select()
                .from(operatingHours)
                .where(and(eq(operatingHours.id, id), eq(operatingHours.salonId, salonId)));
            if (hourArr.length === 0) return res.status(404).json({ message: 'Operating hour not found' });

            await db.delete(operatingHours).where(eq(operatingHours.id, id));
            return res.json({ message: 'Operating hour deleted' });
        } catch (err: any) {
            if (err.message === 'NOT_FOUND') return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN') return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
