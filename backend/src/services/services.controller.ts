import { Response } from 'express';
import { db } from '../database/db';
import { salons, services } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export class ServicesController {
    private static async verifySalonOwnership(salonId: string, adminId: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId));
        if (salonArr.length === 0) throw new Error('NOT_FOUND');
        if (salonArr[0].adminId !== adminId) throw new Error('FORBIDDEN');
        return salonArr[0];
    }

    static async findAll(req: any, res: Response) {
        const salonId = req.params.salonId as string;
        try {
            const result = await db.select().from(services).where(eq(services.salonId, salonId));
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async findOne(req: any, res: Response) {
        const salonId = req.params.salonId as string;
        const id = req.params.id as string;
        try {
            const result = await db
                .select()
                .from(services)
                .where(and(eq(services.id, id), eq(services.salonId, salonId)));
            if (result.length === 0) return res.status(404).json({ message: 'Service not found' });
            return res.json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async create(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const salonId = req.params.salonId as string;
        const { name, duration, price } = req.body;

        try {
            await ServicesController.verifySalonOwnership(salonId, req.user!.sub);

            await db.insert(services).values({
                salonId,
                name: name.trim(),
                duration: parseInt(duration),
                price: parseFloat(price),
            });

            const allServices = await db.select().from(services).where(eq(services.salonId, salonId));
            return res.status(201).json(allServices);
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
        const { name, duration, price } = req.body;

        try {
            await ServicesController.verifySalonOwnership(salonId, req.user!.sub);

            const serviceArr = await db
                .select()
                .from(services)
                .where(and(eq(services.id, id), eq(services.salonId, salonId)));
            if (serviceArr.length === 0) return res.status(404).json({ message: 'Service not found' });

            const updates: Record<string, any> = {};
            if (name?.trim()) updates.name = name.trim();
            if (duration !== undefined) updates.duration = parseInt(duration);
            if (price !== undefined) updates.price = parseFloat(price);

            if (Object.keys(updates).length > 0) {
                await db.update(services).set(updates).where(eq(services.id, id));
            }

            const updated = await db.select().from(services).where(eq(services.id, id));
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
            await ServicesController.verifySalonOwnership(salonId, req.user!.sub);

            const serviceArr = await db
                .select()
                .from(services)
                .where(and(eq(services.id, id), eq(services.salonId, salonId)));
            if (serviceArr.length === 0) return res.status(404).json({ message: 'Service not found' });

            await db.delete(services).where(eq(services.id, id));
            return res.json({ message: 'Service deleted' });
        } catch (err: any) {
            if (err.message === 'NOT_FOUND') return res.status(404).json({ message: 'Salon not found' });
            if (err.message === 'FORBIDDEN') return res.status(403).json({ message: 'Forbidden' });
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
