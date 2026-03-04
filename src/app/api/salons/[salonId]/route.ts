import { db } from "@/db"
import { salons, services, operatingHours } from "@/db/schema"
import { eq } from "drizzle-orm"
import { apiSuccess, apiError, requireAuth, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ salonId: string }> }

// GET /api/salons/[salonId] — Get salon details + services + hours (public)
export async function GET(_req: Request, context: RouteContext) {
    try {
        const { salonId } = await context.params

        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) {
            return apiError("Salon not found", 404)
        }

        const salonServices = await db.select().from(services).where(eq(services.salonId, salonId))
        const salonHours = await db.select().from(operatingHours).where(eq(operatingHours.salonId, salonId))

        return apiSuccess({
            ...salonArr[0],
            services: salonServices,
            operatingHours: salonHours,
        })
    } catch (error) {
        console.error("[GET /api/salons/:id]", error)
        return apiError("Failed to fetch salon", 500)
    }
}

// PUT /api/salons/[salonId] — Update salon (owner SALON_ADMIN only)
export async function PUT(req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const { salonId } = await context.params

        // Verify ownership
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (salonArr[0].adminId !== auth.user.id) return apiError("Forbidden", 403)

        const body = await req.json()
        const updates: Record<string, any> = {}

        if (body.name?.trim()) updates.name = body.name.trim()
        if (body.address?.trim()) updates.address = body.address.trim()

        if (Object.keys(updates).length === 0) {
            return apiError("No valid fields to update")
        }

        await db.update(salons).set(updates).where(eq(salons.id, salonId))

        const updated = await db.select().from(salons).where(eq(salons.id, salonId))
        return apiSuccess(updated[0])
    } catch (error) {
        console.error("[PUT /api/salons/:id]", error)
        return apiError("Failed to update salon", 500)
    }
}

// DELETE /api/salons/[salonId] — Deactivate salon (owner or SUPER_ADMIN)
export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN", "SUPER_ADMIN")
        if (auth.error) return auth.error

        const { salonId } = await context.params

        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)

        // SALON_ADMIN can only delete their own
        if (auth.user.role === "SALON_ADMIN" && salonArr[0].adminId !== auth.user.id) {
            return apiError("Forbidden", 403)
        }

        await db.update(salons).set({ isActive: false }).where(eq(salons.id, salonId))

        return apiSuccess({ message: "Salon deactivated" })
    } catch (error) {
        console.error("[DELETE /api/salons/:id]", error)
        return apiError("Failed to delete salon", 500)
    }
}
