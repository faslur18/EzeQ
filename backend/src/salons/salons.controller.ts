import { Response } from 'express';
import { db } from '../database/db';
import { salons, services, operatingHours } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export class SalonsController {
    // List all approved & active salons (public)
    static async findAll(req: any, res: Response) {
        try {
            const result = await db
                .select()
                .from(salons)
                .where(and(eq(salons.status, 'APPROVED'), eq(salons.isActive, true)))
                .orderBy(desc(salons.rating));
            return res.json(result);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Get a single salon with its services and hours
    static async findOne(req: any, res: Response) {
        const id = req.params.id as string;
        try {
            const salonArr = await db.select().from(salons).where(eq(salons.id, id));
            if (salonArr.length === 0) return res.status(404).json({ message: 'Salon not found' });

            const salonServices = await db.select().from(services).where(eq(services.salonId, id));
            const salonHours = await db.select().from(operatingHours).where(eq(operatingHours.salonId, id));

            return res.json({
                ...salonArr[0],
                services: salonServices,
                operatingHours: salonHours,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Get the admin's salon
    static async findMySalon(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, req.user!.sub));
            if (salonArr.length === 0) return res.status(404).json({ message: 'Salon not found' });

            const salonServices = await db.select().from(services).where(eq(services.salonId, salonArr[0].id));
            const salonHours = await db.select().from(operatingHours).where(eq(operatingHours.salonId, salonArr[0].id));

            return res.json({
                ...salonArr[0],
                services: salonServices,
                operatingHours: salonHours,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Create a new salon (SALON_ADMIN)
    static async create(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { name, address } = req.body;

        try {
            const user = req.user!;
            const existing = await db.select().from(salons).where(eq(salons.adminId, user.sub));
            if (existing.length > 0) {
                return res.status(409).json({ message: 'You already have a salon registered' });
            }

            await db.insert(salons).values({
                adminId: user.sub,
                name: name.trim(),
                address: address.trim(),
                rating: 0,
                isActive: true,
                status: 'PENDING',
            });

            const created = await db.select().from(salons).where(eq(salons.adminId, user.sub));
            return res.status(201).json(created[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Update salon info (owner only)
    static async update(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const { name, address } = req.body;
        const user = req.user!;

        try {
            const salonArr = await db.select().from(salons).where(eq(salons.id, id));
            if (salonArr.length === 0) return res.status(404).json({ message: 'Salon not found' });
            if (user.role !== 'SUPER_ADMIN' && salonArr[0].adminId !== user.sub) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const updates: Record<string, any> = {};
            if (name?.trim()) updates.name = name.trim();
            if (address?.trim()) updates.address = address.trim();

            if (Object.keys(updates).length > 0) {
                await db.update(salons).set(updates).where(eq(salons.id, id));
            }

            const updated = await db.select().from(salons).where(eq(salons.id, id));
            return res.json(updated[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Deactivate salon (owner or SUPER_ADMIN)
    static async remove(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const user = req.user!;

        try {
            const salonArr = await db.select().from(salons).where(eq(salons.id, id));
            if (salonArr.length === 0) return res.status(404).json({ message: 'Salon not found' });

            if (user.role !== 'SUPER_ADMIN' && salonArr[0].adminId !== user.sub) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            await db.update(salons).set({ isActive: false }).where(eq(salons.id, id));
            return res.json({ message: 'Salon deactivated' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
