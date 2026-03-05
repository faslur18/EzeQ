import { Response } from 'express';
import { db } from '../database/db';
import { appointments, services, salons, users } from '../database/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.middleware';

export class AppointmentsController {
    static async findAll(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { sub: userId, role: userRole } = req.user!;

        try {
            if (userRole === 'CUSTOMER') {
                const result = await db
                    .select({
                        appointments: appointments,
                        service: services,
                        salon: salons
                    })
                    .from(appointments)
                    .leftJoin(services, eq(appointments.serviceId, services.id))
                    .leftJoin(salons, eq(appointments.salonId, salons.id))
                    .where(eq(appointments.customerId, userId))
                    .orderBy(desc(appointments.createdAt));
                return res.json(result);
            }

            if (userRole === 'SALON_ADMIN') {
                const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
                if (salonArr.length === 0) return res.json([]);

                const result = await db
                    .select({
                        appointments: appointments,
                        service: services,
                        customer: users
                    })
                    .from(appointments)
                    .leftJoin(services, eq(appointments.serviceId, services.id))
                    .leftJoin(users, eq(appointments.customerId, users.id))
                    .where(eq(appointments.salonId, salonArr[0].id))
                    .orderBy(desc(appointments.createdAt));
                return res.json(result);
            }

            if (userRole === 'SUPER_ADMIN') {
                const result = await db
                    .select({
                        appointments: appointments,
                        service: services,
                        salon: salons,
                        customer: users
                    })
                    .from(appointments)
                    .leftJoin(services, eq(appointments.serviceId, services.id))
                    .leftJoin(salons, eq(appointments.salonId, salons.id))
                    .leftJoin(users, eq(appointments.customerId, users.id))
                    .orderBy(desc(appointments.createdAt));
                return res.json(result);
            }

            return res.status(403).json({ message: 'Forbidden' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async findOne(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const { sub: userId, role: userRole } = req.user!;

        try {
            const result = await db
                .select({
                    appointments: appointments,
                    service: services,
                    salon: salons
                })
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(salons, eq(appointments.salonId, salons.id))
                .where(eq(appointments.id, id));

            if (result.length === 0) return res.status(404).json({ message: 'Appointment not found' });
            const appt: any = result[0];

            // Authorization check
            if (userRole === 'CUSTOMER' && appt.appointments.customerId !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            if (userRole === 'SALON_ADMIN') {
                const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
                if (salonArr.length === 0 || appt.appointments.salonId !== salonArr[0].id) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }

            return res.json(appt);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async create(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { salonId, serviceId, date, startTime } = req.body;

        try {
            // Validate salon
            const salonArr = await db.select().from(salons).where(eq(salons.id, salonId));
            if (salonArr.length === 0) return res.status(404).json({ message: 'Salon not found' });
            if (!salonArr[0].isActive || salonArr[0].status !== 'APPROVED') {
                return res.status(400).json({ message: 'Salon is not available for bookings' });
            }

            // Validate service
            const serviceArr = await db
                .select()
                .from(services)
                .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)));
            if (serviceArr.length === 0) return res.status(404).json({ message: 'Service not found for this salon' });

            // Check for time conflicts
            const existingAppts = await db
                .select()
                .from(appointments)
                .where(
                    and(
                        eq(appointments.salonId, salonId),
                        eq(appointments.appointmentDate, date),
                        eq(appointments.startTime, startTime),
                        ne(appointments.status, 'CANCELLED'),
                    ),
                );

            if (existingAppts.length > 0) {
                return res.status(409).json({ message: 'Time slot is no longer available' });
            }

            await db.insert(appointments).values({
                customerId: req.user!.sub,
                salonId,
                serviceId,
                appointmentDate: date,
                startTime,
                status: 'CONFIRMED',
            });

            const created = await db
                .select()
                .from(appointments)
                .where(
                    and(
                        eq(appointments.customerId, req.user!.sub),
                        eq(appointments.salonId, salonId),
                        eq(appointments.appointmentDate, date),
                        eq(appointments.startTime, startTime),
                    ),
                );

            return res.status(201).json(created[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updateStatus(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const { status } = req.body;
        const { sub: userId, role: userRole } = req.user!;

        try {
            const apptArr = await db.select().from(appointments).where(eq(appointments.id, id));
            if (apptArr.length === 0) return res.status(404).json({ message: 'Appointment not found' });
            const appt = apptArr[0];

            // Authorization
            if (userRole === 'CUSTOMER') {
                if (appt.customerId !== userId) return res.status(403).json({ message: 'Forbidden' });
                if (status !== 'CANCELLED') return res.status(403).json({ message: 'Customers can only cancel' });
            } else if (userRole === 'SALON_ADMIN') {
                const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
                if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }

            await db.update(appointments).set({ status }).where(eq(appointments.id, id));
            const updated = await db.select().from(appointments).where(eq(appointments.id, id));
            return res.json(updated[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async remove(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const id = req.params.id as string;
        const { sub: userId, role: userRole } = req.user!;

        try {
            const apptArr = await db.select().from(appointments).where(eq(appointments.id, id));
            if (apptArr.length === 0) return res.status(404).json({ message: 'Appointment not found' });
            const appt = apptArr[0];

            if (userRole === 'CUSTOMER' && appt.customerId !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            if (userRole === 'SALON_ADMIN') {
                const salonArr = await db.select().from(salons).where(eq(salons.adminId, userId));
                if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }

            await db.update(appointments).set({ status: 'CANCELLED' }).where(eq(appointments.id, id));
            return res.json({ message: 'Appointment cancelled' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
