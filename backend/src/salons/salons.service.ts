import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../database/database.module';
import { salons, services, operatingHours } from '../database/schema';
import { CreateSalonDto, UpdateSalonDto } from './dto';

@Injectable()
export class SalonsService {
    // List all approved & active salons (public)
    async findAll() {
        return db
            .select()
            .from(salons)
            .where(and(eq(salons.status, 'APPROVED'), eq(salons.isActive, true)))
            .orderBy(desc(salons.rating));
    }

    // Get a single salon with its services and hours
    async findOne(id: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, id));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');

        const salonServices = await db.select().from(services).where(eq(services.salonId, id));
        const salonHours = await db.select().from(operatingHours).where(eq(operatingHours.salonId, id));

        return {
            ...salonArr[0],
            services: salonServices,
            operatingHours: salonHours,
        };
    }

    // Create a new salon (SALON_ADMIN)
    async create(adminId: string, dto: CreateSalonDto) {
        const existing = await db.select().from(salons).where(eq(salons.adminId, adminId));
        if (existing.length > 0) {
            throw new ConflictException('You already have a salon registered');
        }

        await db.insert(salons).values({
            adminId,
            name: dto.name.trim(),
            address: dto.address.trim(),
            rating: 0,
            isActive: true,
            status: 'PENDING',
        });

        const created = await db.select().from(salons).where(eq(salons.adminId, adminId));
        return created[0];
    }

    // Update salon info (owner only)
    async update(id: string, adminId: string, dto: UpdateSalonDto) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, id));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');
        if (salonArr[0].adminId !== adminId) throw new ForbiddenException('Not your salon');

        const updates: Record<string, any> = {};
        if (dto.name?.trim()) updates.name = dto.name.trim();
        if (dto.address?.trim()) updates.address = dto.address.trim();

        if (Object.keys(updates).length === 0) return salonArr[0];

        await db.update(salons).set(updates).where(eq(salons.id, id));
        const updated = await db.select().from(salons).where(eq(salons.id, id));
        return updated[0];
    }

    // Deactivate salon (owner or SUPER_ADMIN)
    async remove(id: string, userId: string, userRole: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, id));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');

        if (userRole === 'SALON_ADMIN' && salonArr[0].adminId !== userId) {
            throw new ForbiddenException('Not your salon');
        }

        await db.update(salons).set({ isActive: false }).where(eq(salons.id, id));
        return { message: 'Salon deactivated' };
    }
}
