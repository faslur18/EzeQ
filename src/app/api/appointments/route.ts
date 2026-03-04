import { db } from "@/db"
import { appointments, services, salons, users } from "@/db/schema"
import { eq, and, desc, ne, gte, lte } from "drizzle-orm"
import { apiSuccess, apiCreated, apiError, requireAuth, requireRole } from "@/lib/api-utils"
import { addMinutes, format, parse, isBefore, startOfDay, endOfDay } from "date-fns"

// GET /api/appointments — List appointments for the current user (role-aware)
export async function GET() {
    try {
        const auth = await requireAuth()
        if (auth.error) return auth.error

        if (auth.user.role === "CUSTOMER") {
            // Customers see their own appointments joined with service/salon info
            const result = await db
                .select()
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(salons, eq(appointments.salonId, salons.id))
                .where(eq(appointments.customerId, auth.user.id))
                .orderBy(desc(appointments.createdAt))

            return apiSuccess(result)
        }

        if (auth.user.role === "SALON_ADMIN") {
            // Salon admins see appointments for their salon
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, auth.user.id))
            if (salonArr.length === 0) return apiSuccess([])

            const result = await db
                .select()
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(users, eq(appointments.customerId, users.id))
                .where(eq(appointments.salonId, salonArr[0].id))
                .orderBy(desc(appointments.createdAt))

            return apiSuccess(result)
        }

        if (auth.user.role === "SUPER_ADMIN") {
            // Super admins see all
            const result = await db
                .select()
                .from(appointments)
                .leftJoin(services, eq(appointments.serviceId, services.id))
                .leftJoin(salons, eq(appointments.salonId, salons.id))
                .leftJoin(users, eq(appointments.customerId, users.id))
                .orderBy(desc(appointments.createdAt))

            return apiSuccess(result)
        }

        return apiError("Unknown role", 403)
    } catch (error) {
        console.error("[GET /api/appointments]", error)
        return apiError("Failed to fetch appointments", 500)
    }
}

// POST /api/appointments — Create/book an appointment (CUSTOMER only)
export async function POST(req: Request) {
    try {
        const auth = await requireRole("CUSTOMER")
        if (auth.error) return auth.error

        const body = await req.json()
        const { salonId, serviceId, date, startTime } = body

        if (!salonId || !serviceId || !date || !startTime) {
            return apiError("salonId, serviceId, date, and startTime are required")
        }

        // Validate salon exists and is active
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (!salonArr[0].isActive || salonArr[0].status !== "APPROVED") {
            return apiError("Salon is not available for bookings")
        }

        // Validate service exists
        const serviceArr = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)))
        if (serviceArr.length === 0) return apiError("Service not found for this salon", 404)

        const service = serviceArr[0]
        const selectedDate = new Date(date)
        const dayOfWeek = selectedDate.getDay()

        // Check operating hours
        const { operatingHours } = await import("@/db/schema")
        const hoursArr = await db
            .select()
            .from(operatingHours)
            .where(
                and(
                    eq(operatingHours.salonId, salonId),
                    eq(operatingHours.dayOfWeek, dayOfWeek)
                )
            )

        if (hoursArr.length === 0) return apiError("Salon is closed on this day")

        // Check for time slot conflicts
        const existingAppts = await db
            .select({ startTime: appointments.startTime, duration: services.duration })
            .from(appointments)
            .innerJoin(services, eq(appointments.serviceId, services.id))
            .where(
                and(
                    eq(appointments.salonId, salonId),
                    eq(appointments.appointmentDate, date),
                    ne(appointments.status, "CANCELLED")
                )
            )

        const requestedStart = parse(startTime, "HH:mm", selectedDate)
        const requestedEnd = addMinutes(requestedStart, service.duration)

        const hasConflict = existingAppts.some((appt) => {
            const apptStart = parse(appt.startTime, "HH:mm", selectedDate)
            const apptEnd = addMinutes(apptStart, appt.duration)
            return isBefore(requestedStart, apptEnd) && isBefore(apptStart, requestedEnd)
        })

        if (hasConflict) return apiError("Time slot is no longer available", 409)

        // Create the appointment
        await db.insert(appointments).values({
            customerId: auth.user.id,
            salonId,
            serviceId,
            appointmentDate: date,
            startTime,
            status: "CONFIRMED",
        })

        // Return the created appointment
        const created = await db
            .select()
            .from(appointments)
            .where(
                and(
                    eq(appointments.customerId, auth.user.id),
                    eq(appointments.salonId, salonId),
                    eq(appointments.appointmentDate, date),
                    eq(appointments.startTime, startTime)
                )
            )

        return apiCreated(created[0])
    } catch (error) {
        console.error("[POST /api/appointments]", error)
        return apiError("Failed to create appointment", 500)
    }
}
