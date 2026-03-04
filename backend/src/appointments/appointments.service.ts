import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { eq, and, ne, desc } from 'drizzle-orm';
import { db } from '../database/database.module';
import { appointments, services, salons, users, operatingHours } from '../database/schema';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto';

@Injectable()
export class AppointmentsService {
    // List appointments (role-aware)
    async findAll(userId: string, userRole: string) {
        if (userRole === 'CUSTOMER') {
            return db
                .select()
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(salons, eq(appointments.salonId, salons.id))
                .where(eq(appointments.customerId, userId))
                .orderBy(desc(appointments.createdAt));
        }

        if (userRole === 'SALON_ADMIN') {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
            if (salonArr.length === 0) return [];

            return db
                .select()
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(users, eq(appointments.customerId, users.id))
                .where(eq(appointments.salonId, salonArr[0].id))
                .orderBy(desc(appointments.createdAt));
        }

        if (userRole === 'SUPER_ADMIN') {
            return db
                .select()
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(salons, eq(appointments.salonId, salons.id))
                .leftJoin(users, eq(appointments.customerId, users.id))
                .orderBy(desc(appointments.createdAt));
        }

        return [];
    }

    // Get single appointment
    async findOne(id: string, userId: string, userRole: string) {
        const result = await db
            .select()
            .from(appointments)
            .leftJoin(services, eq(appointments.serviceId, services.id))
            .leftJoin(salons, eq(appointments.salonId, salons.id))
            .where(eq(appointments.id, id));

        if (result.length === 0) throw new NotFoundException('Appointment not found');
        const appt = result[0];

        // Authorization check
        if (userRole === 'CUSTOMER' && appt.appointments.customerId !== userId) {
            throw new ForbiddenException('Not your appointment');
        }
        if (userRole === 'SALON_ADMIN') {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
            if (salonArr.length === 0 || appt.appointments.salonId !== salonArr[0].id) {
                throw new ForbiddenException('Not your salon\'s appointment');
            }
        }

        return appt;
    }

    // Create/book appointment
    async create(customerId: string, dto: CreateAppointmentDto) {
        // Validate salon
        const salonArr = await db.select().from(salons).where(eq(salons.id, dto.salonId));
        if (salonArr.length === 0) throw new NotFoundException('Salon not found');
        if (!salonArr[0].isActive || salonArr[0].status !== 'APPROVED') {
            throw new BadRequestException('Salon is not available for bookings');
        }

        // Validate service
        const serviceArr = await db
            .select()
            .from(services)
            .where(and(eq(services.id, dto.serviceId), eq(services.salonId, dto.salonId)));
        if (serviceArr.length === 0) throw new NotFoundException('Service not found for this salon');

        // Check for time conflicts
        const existingAppts = await db
            .select()
            .from(appointments)
            .where(
                and(
                    eq(appointments.salonId, dto.salonId),
                    eq(appointments.appointmentDate, dto.date),
                    eq(appointments.startTime, dto.startTime),
                    ne(appointments.status, 'CANCELLED'),
                ),
            );

        if (existingAppts.length > 0) {
            throw new ConflictException('Time slot is no longer available');
        }

        await db.insert(appointments).values({
            customerId,
            salonId: dto.salonId,
            serviceId: dto.serviceId,
            appointmentDate: dto.date,
            startTime: dto.startTime,
            status: 'CONFIRMED',
        });

        // Return created
        const created = await db
            .select()
            .from(appointments)
            .where(
                and(
                    eq(appointments.customerId, customerId),
                    eq(appointments.salonId, dto.salonId),
                    eq(appointments.appointmentDate, dto.date),
                    eq(appointments.startTime, dto.startTime),
                ),
            );

        return created[0];
    }

    // Update status
    async updateStatus(id: string, userId: string, userRole: string, dto: UpdateAppointmentStatusDto) {
        const apptArr = await db.select().from(appointments).where(eq(appointments.id, id));
        if (apptArr.length === 0) throw new NotFoundException('Appointment not found');
        const appt = apptArr[0];

        // Authorization
        if (userRole === 'CUSTOMER') {
            if (appt.customerId !== userId) throw new ForbiddenException('Not your appointment');
            if (dto.status !== 'CANCELLED') throw new ForbiddenException('Customers can only cancel');
        } else if (userRole === 'SALON_ADMIN') {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
            if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                throw new ForbiddenException('Not your salon\'s appointment');
            }
        }

        await db.update(appointments).set({ status: dto.status }).where(eq(appointments.id, id));
        const updated = await db.select().from(appointments).where(eq(appointments.id, id));
        return updated[0];
    }

    // Cancel (soft delete)
    async remove(id: string, userId: string, userRole: string) {
        const apptArr = await db.select().from(appointments).where(eq(appointments.id, id));
        if (apptArr.length === 0) throw new NotFoundException('Appointment not found');
        const appt = apptArr[0];

        if (userRole === 'CUSTOMER' && appt.customerId !== userId) {
            throw new ForbiddenException('Not your appointment');
        }
        if (userRole === 'SALON_ADMIN') {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
            if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                throw new ForbiddenException('Not your salon\'s appointment');
            }
        }

        await db.update(appointments).set({ status: 'CANCELLED' }).where(eq(appointments.id, id));
        return { message: 'Appointment cancelled' };
    }
}
