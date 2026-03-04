import { db } from "@/db"
import { salons } from "@/db/schema"
import { eq } from "drizzle-orm"
import { apiSuccess, apiError, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ salonId: string }> }

// PATCH /api/admin/salons/[salonId] — Approve or reject a salon (SUPER_ADMIN only)
export async function PATCH(req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SUPER_ADMIN")
        if (auth.error) return auth.error

        const { salonId } = await context.params

        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)

        const body = await req.json()
        const { status } = body

        if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
            return apiError("Valid status required: APPROVED, REJECTED, or PENDING")
        }

        await db
            .update(salons)
            .set({
                status,
                isActive: status === "APPROVED",
            })
            .where(eq(salons.id, salonId))

        const updated = await db.select().from(salons).where(eq(salons.id, salonId))
        return apiSuccess(updated[0])
    } catch (error) {
        console.error("[PATCH /api/admin/salons/:id]", error)
        return apiError("Failed to update salon status", 500)
    }
}
