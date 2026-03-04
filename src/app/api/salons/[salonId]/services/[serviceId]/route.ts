import { db } from "@/db"
import { salons, services } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { apiSuccess, apiError, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ salonId: string; serviceId: string }> }

// GET /api/salons/[salonId]/services/[serviceId] — Get a single service
export async function GET(_req: Request, context: RouteContext) {
    try {
        const { salonId, serviceId } = await context.params

        const result = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)))

        if (result.length === 0) return apiError("Service not found", 404)
        return apiSuccess(result[0])
    } catch (error) {
        console.error("[GET /api/salons/:id/services/:sid]", error)
        return apiError("Failed to fetch service", 500)
    }
}

// PUT /api/salons/[salonId]/services/[serviceId] — Update a service
export async function PUT(req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const { salonId, serviceId } = await context.params

        // Verify ownership
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (salonArr[0].adminId !== auth.user.id) return apiError("Forbidden", 403)

        const serviceArr = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)))

        if (serviceArr.length === 0) return apiError("Service not found", 404)

        const body = await req.json()
        const updates: Record<string, any> = {}

        if (body.name?.trim()) updates.name = body.name.trim()
        if (body.duration !== undefined && Number(body.duration) > 0) updates.duration = Number(body.duration)
        if (body.price !== undefined && Number(body.price) >= 0) updates.price = Number(body.price)

        if (Object.keys(updates).length === 0) return apiError("No valid fields to update")

        await db.update(services).set(updates).where(eq(services.id, serviceId))

        const updated = await db.select().from(services).where(eq(services.id, serviceId))
        return apiSuccess(updated[0])
    } catch (error) {
        console.error("[PUT /api/salons/:id/services/:sid]", error)
        return apiError("Failed to update service", 500)
    }
}

// DELETE /api/salons/[salonId]/services/[serviceId] — Delete a service
export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const { salonId, serviceId } = await context.params

        // Verify ownership
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (salonArr[0].adminId !== auth.user.id) return apiError("Forbidden", 403)

        const serviceArr = await db
            .select()
            .from(services)
            .where(and(eq(services.id, serviceId), eq(services.salonId, salonId)))

        if (serviceArr.length === 0) return apiError("Service not found", 404)

        await db.delete(services).where(eq(services.id, serviceId))

        return apiSuccess({ message: "Service deleted" })
    } catch (error) {
        console.error("[DELETE /api/salons/:id/services/:sid]", error)
        return apiError("Failed to delete service", 500)
    }
}
