import { db } from "@/db"
import { salons, operatingHours } from "@/db/schema"
import { eq } from "drizzle-orm"
import { apiSuccess, apiCreated, apiError, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ salonId: string }> }

// GET /api/salons/[salonId]/hours — List all operating hours for a salon (public)
export async function GET(_req: Request, context: RouteContext) {
    try {
        const { salonId } = await context.params

        const result = await db
            .select()
            .from(operatingHours)
            .where(eq(operatingHours.salonId, salonId))

        return apiSuccess(result)
    } catch (error) {
        console.error("[GET /api/salons/:id/hours]", error)
        return apiError("Failed to fetch operating hours", 500)
    }
}

// POST /api/salons/[salonId]/hours — Set/replace all hours (owner SALON_ADMIN only)
// Body: { hours: [{ dayOfWeek: 0-6, openTime: "09:00", closeTime: "18:00" }, ...] }
export async function POST(req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const { salonId } = await context.params

        // Verify ownership
        const salonArr = await db.select().from(salons).where(eq(salons.id, salonId))
        if (salonArr.length === 0) return apiError("Salon not found", 404)
        if (salonArr[0].adminId !== auth.user.id) return apiError("Forbidden", 403)

        const body = await req.json()
        const { hours } = body

        if (!Array.isArray(hours)) {
            return apiError("'hours' must be an array")
        }

        // Validate each entry
        for (const h of hours) {
            if (h.dayOfWeek === undefined || h.dayOfWeek < 0 || h.dayOfWeek > 6) {
                return apiError("dayOfWeek must be 0-6")
            }
            if (!h.openTime || !h.closeTime) {
                return apiError("openTime and closeTime are required for each day")
            }
        }

        // Delete existing hours and replace
        await db.delete(operatingHours).where(eq(operatingHours.salonId, salonId))

        if (hours.length > 0) {
            await db.insert(operatingHours).values(
                hours.map((h: any) => ({
                    salonId,
                    dayOfWeek: Number(h.dayOfWeek),
                    openTime: h.openTime,
                    closeTime: h.closeTime,
                }))
            )
        }

        const result = await db
            .select()
            .from(operatingHours)
            .where(eq(operatingHours.salonId, salonId))

        return apiCreated(result)
    } catch (error) {
        console.error("[POST /api/salons/:id/hours]", error)
        return apiError("Failed to set operating hours", 500)
    }
}
