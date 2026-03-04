import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../database/database.module';
import { users } from '../database/schema';

@Injectable()
export class UsersService {
    async findAll() {
        return db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users);
    }

    async findOne(id: string) {
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

        if (result.length === 0) throw new NotFoundException('User not found');
        return result[0];
    }

    async updateRole(id: string, currentUserId: string, role: string) {
        if (id === currentUserId) throw new BadRequestException('Cannot modify your own role');

        const userArr = await db.select().from(users).where(eq(users.id, id));
        if (userArr.length === 0) throw new NotFoundException('User not found');

        if (!['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'].includes(role)) {
            throw new BadRequestException('Invalid role');
        }

        await db.update(users).set({ role }).where(eq(users.id, id));
        return this.findOne(id);
    }

    async remove(id: string, currentUserId: string) {
        if (id === currentUserId) throw new BadRequestException('Cannot delete your own account');

        const userArr = await db.select().from(users).where(eq(users.id, id));
        if (userArr.length === 0) throw new NotFoundException('User not found');

        await db.delete(users).where(eq(users.id, id));
        return { message: 'User deleted' };
    }
}
