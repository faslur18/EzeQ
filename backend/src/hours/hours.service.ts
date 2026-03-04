import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from '../database/database.module';
import { salons, operatingHours } from '../database/schema';
import { SetHoursDto, UpdateHourDto } from './dto';

@Injectable()
export class HoursService {
    private async verifySalonOwnership(salonId: string, adminId: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');
        if (salonArr[0].adminId !== adminId) throw new ForbiddenException('Not your salon');
        return salonArr[0];
    }

    async findAll(salonId: string) {
        return db.select().from(operatingHours).where(eq(operatingHours.salonId, salonId));
    }

    async setAll(salonId: string, adminId: string, dto: SetHoursDto) {
        await this.verifySalonOwnership(salonId, adminId);

        // Delete existing and replace
        await db.delete(operatingHours).where(eq(operatingHours.salonId, salonId));

        if (dto.hours.length > 0) {
            await db.insert(operatingHours).values(
                dto.hours.map((h) => ({
                    salonId,
                    dayOfWeek: h.dayOfWeek,
                    openTime: h.openTime,
                    closeTime: h.closeTime,
                })),
            );
        }

        return db.select().from(operatingHours).where(eq(operatingHours.salonId, salonId));
    }

    async update(salonId: string, hourId: string, adminId: string, dto: UpdateHourDto) {
        await this.verifySalonOwnership(salonId, adminId);

        const hourArr = await db
            .select()
            .from(operatingHours)
            .where(and(eq(operatingHours.id, hourId), eq(operatingHours.salonId, salonId)));
        if (hourArr.length === 0) throw new NotFoundException('Operating hour not found');

        const updates: Record<string, any> = {};
        if (dto.openTime) updates.openTime = dto.openTime;
        if (dto.closeTime) updates.closeTime = dto.closeTime;
        if (dto.dayOfWeek !== undefined) updates.dayOfWeek = dto.dayOfWeek;

        if (Object.keys(updates).length === 0) return hourArr[0];

        await db.update(operatingHours).set(updates).where(eq(operatingHours.id, hourId));
        const updated = await db.select().from(operatingHours).where(eq(operatingHours.id, hourId));
        return updated[0];
    }

    async remove(salonId: string, hourId: string, adminId: string) {
        await this.verifySalonOwnership(salonId, adminId);

        const hourArr = await db
            .select()
            .from(operatingHours)
            .where(and(eq(operatingHours.id, hourId), eq(operatingHours.salonId, salonId)));
        if (hourArr.length === 0) throw new NotFoundException('Operating hour not found');

        await db.delete(operatingHours).where(eq(operatingHours.id, hourId));
        return { message: 'Operating hour deleted' };
    }
}
