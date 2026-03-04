import { db } from "@/db"
import { salons, operatingHours } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { apiSuccess, apiError, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ salonId: string; hourId: string }> }

// PUT /api/salons/[salonId]/hours/[hourId] — Update a single day's hours
export async function PUT(req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const { salonId, hourId } = await context.params

        // Verify ownership
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (salonArr[0].adminId !== auth.user.id) return apiError("Forbidden", 403)

        const hourArr = await db
            .select()
            .from(operatingHours)
            .where(and(eq(operatingHours.id, hourId), eq(operatingHours.salonId, salonId)))

        if (hourArr.length === 0) return apiError("Operating hour not found", 404)

        const body = await req.json()
        const updates: Record<string, any> = {}

        if (body.openTime) updates.openTime = body.openTime
        if (body.closeTime) updates.closeTime = body.closeTime
        if (body.dayOfWeek !== undefined) updates.dayOfWeek = Number(body.dayOfWeek)

        if (Object.keys(updates).length === 0) return apiError("No valid fields to update")

        await db.update(operatingHours).set(updates).where(eq(operatingHours.id, hourId))

        const updated = await db.select().from(operatingHours).where(eq(operatingHours.id, hourId))
        return apiSuccess(updated[0])
    } catch (error) {
        console.error("[PUT /api/salons/:id/hours/:hid]", error)
        return apiError("Failed to update operating hour", 500)
    }
}

// DELETE /api/salons/[salonId]/hours/[hourId] — Remove a day's hours
export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const { salonId, hourId } = await context.params

        // Verify ownership
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (salonArr[0].adminId !== auth.user.id) return apiError("Forbidden", 403)

        const hourArr = await db
            .select()
            .from(operatingHours)
            .where(and(eq(operatingHours.id, hourId), eq(operatingHours.salonId, salonId)))

        if (hourArr.length === 0) return apiError("Operating hour not found", 404)

        await db.delete(operatingHours).where(eq(operatingHours.id, hourId))

        return apiSuccess({ message: "Operating hour deleted" })
    } catch (error) {
        console.error("[DELETE /api/salons/:id/hours/:hid]", error)
        return apiError("Failed to delete operating hour", 500)
    }
}
