import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/database.module';
import { salons, services } from '../database/schema';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@Injectable()
export class ServicesService {
    // Verify salon ownership (reused in multiple methods)
    private async verifySalonOwnership(salonId: string, adminId: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');
        if (salonArr[0].adminId !== adminId) throw new ForbiddenException('Not your salon');
        return salonArr[0];
    }

    async findAll(salonId: string) {
        return db.select().from(services).where(eq(services.salonId, salonId));
    }

    async findOne(salonId: string, serviceId: string) {
        const result = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)));
        if (result.length === 0) throw new NotFoundException('Service not found');
        return result[0];
    }

    async create(salonId: string, adminId: string, dto: CreateServiceDto) {
        await this.verifySalonOwnership(salonId, adminId);

        await db.insert(services).values({
            salonId,
            name: dto.name.trim(),
            duration: dto.duration,
            price: dto.price,
        });

        return db.select().from(services).where(eq(services.salonId, salonId));
    }

    async update(salonId: string, serviceId: string, adminId: string, dto: UpdateServiceDto) {
        await this.verifySalonOwnership(salonId, adminId);

        const serviceArr = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)));
        if (serviceArr.length === 0) throw new NotFoundException('Service not found');

        const updates: Record<string, any> = {};
        if (dto.name?.trim()) updates.name = dto.name.trim();
        if (dto.duration !== undefined) updates.duration = dto.duration;
        if (dto.price !== undefined) updates.price = dto.price;

        if (Object.keys(updates).length === 0) return serviceArr[0];

        await db.update(services).set(updates).where(eq(services.id, serviceId));
        const updated = await db.select().from(services).where(eq(services.id, serviceId));
        return updated[0];
    }

    async remove(salonId: string, serviceId: string, adminId: string) {
        await this.verifySalonOwnership(salonId, adminId);

        const serviceArr = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)));
        if (serviceArr.length === 0) throw new NotFoundException('Service not found');

        await db.delete(services).where(eq(services.id, serviceId));
        return { message: 'Service deleted' };
    }
}
