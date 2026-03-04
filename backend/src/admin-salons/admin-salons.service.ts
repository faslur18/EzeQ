import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import { db } from '../database/database.module';
import { salons, users } from '../database/schema';

@Injectable()
export class AdminSalonsService {
    async findAll() {
        return db
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
    }

    async updateStatus(id: string, status: string) {
        const salonArr = await db.select().from(salons).where(eq(salons.id, id));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');

        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
            throw new NotFoundException('Invalid status');
        }

        await db
            .update(salons)
            .set({ status, isActive: status === 'APPROVED' })
            .where(eq(salons.id, id));

        const updated = await db.select().from(salons).where(eq(salons.id, id));
        return updated[0];
    }
}
