import { db } from "@/db"
import { appointments, services, salons, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { apiSuccess, apiError, requireAuth } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ appointmentId: string }> }

// GET /api/appointments/[appointmentId] — Get a single appointment
export async function GET(_req: Request, context: RouteContext) {
    try {
        const auth = await requireAuth()
        if (auth.error) return auth.error

        const { appointmentId } = await context.params

        const result = await db
            .select()
            .from(appointments)
            .leftJoin(services, eq(appointments.serviceId, services.id))
            .leftJoin(salons, eq(appointments.salonId, salons.id))
            .leftJoin(users, eq(appointments.customerId, users.id))
            .where(eq(appointments.id, appointmentId))

        if (result.length === 0) return apiError("Appointment not found", 404)

        const appt = result[0]

        // Authorization: customer can see own, salon admin can see their salon's, super admin sees all
        if (auth.user.role === "CUSTOMER" && appt.appointments.customerId !== auth.user.id) {
            return apiError("Forbidden", 403)
        }
        if (auth.user.role === "SALON_ADMIN") {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, auth.user.id))
            if (salonArr.length === 0 || appt.appointments.salonId !== salonArr[0].id) {
                return apiError("Forbidden", 403)
            }
        }

        return apiSuccess(appt)
    } catch (error) {
        console.error("[GET /api/appointments/:id]", error)
        return apiError("Failed to fetch appointment", 500)
    }
}

// PATCH /api/appointments/[appointmentId] — Update appointment status
export async function PATCH(req: Request, context: RouteContext) {
    try {
        const auth = await requireAuth()
        if (auth.error) return auth.error

        const { appointmentId } = await context.params

        const apptArr = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
        if (apptArr.length === 0) return apiError("Appointment not found", 404)
        const appt = apptArr[0]

        const body = await req.json()
        const { status } = body

        if (!status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
            return apiError("Valid status required: PENDING, CONFIRMED, or CANCELLED")
        }

        // Authorization rules
        if (auth.user.role === "CUSTOMER") {
            // Customers can only cancel their own appointments
            if (appt.customerId !== auth.user.id) return apiError("Forbidden", 403)
            if (status !== "CANCELLED") return apiError("Customers can only cancel appointments")
        } else if (auth.user.role === "SALON_ADMIN") {
            // Salon admins can confirm or cancel appointments for their salon
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, auth.user.id))
            if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                return apiError("Forbidden", 403)
            }
        } else if (auth.user.role !== "SUPER_ADMIN") {
            return apiError("Forbidden", 403)
        }

        await db.update(appointments).set({ status }).where(eq(appointments.id, appointmentId))

        const updated = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
        return apiSuccess(updated[0])
    } catch (error) {
        console.error("[PATCH /api/appointments/:id]", error)
        return apiError("Failed to update appointment", 500)
    }
}

// DELETE /api/appointments/[appointmentId] — Cancel an appointment
export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireAuth()
        if (auth.error) return auth.error

        const { appointmentId } = await context.params

        const apptArr = await db.select().from(appointments).where(eq(appointments.id, appointmentId))
        if (apptArr.length === 0) return apiError("Appointment not found", 404)
        const appt = apptArr[0]

        // Authorization
        if (auth.user.role === "CUSTOMER" && appt.customerId !== auth.user.id) {
            return apiError("Forbidden", 403)
        }
        if (auth.user.role === "SALON_ADMIN") {
            const salonArr = await db.select().from(salons).where(eq(salons.adminId, auth.user.id))
            if (salonArr.length === 0 || appt.salonId !== salonArr[0].id) {
                return apiError("Forbidden", 403)
            }
        }

        await db
            .update(appointments)
            .set({ status: "CANCELLED" })
            .where(eq(appointments.id, appointmentId))

        return apiSuccess({ message: "Appointment cancelled" })
    } catch (error) {
        console.error("[DELETE /api/appointments/:id]", error)
        return apiError("Failed to cancel appointment", 500)
    }
}
