import { db } from "@/db"
import { salons, services } from "@/db/schema"
import { eq } from "drizzle-orm"
import { apiSuccess, apiCreated, apiError, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ salonId: string }> }

// GET /api/salons/[salonId]/services — List services for a salon (public)
export async function GET(_req: Request, context: RouteContext) {
    try {
        const { salonId } = await context.params

        const result = await db.select().from(services).where(eq(services.salonId, salonId))
        return apiSuccess(result)
    } catch (error) {
        console.error("[GET /api/salons/:id/services]", error)
        return apiError("Failed to fetch services", 500)
    }
}

// POST /api/salons/[salonId]/services — Add a service (owner SALON_ADMIN only)
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
        const { name, duration, price } = body

        if (!name?.trim() || !duration || price === undefined) {
            return apiError("name, duration, and price are required")
        }

        if (Number(duration) <= 0) return apiError("Duration must be positive")
        if (Number(price) < 0) return apiError("Price cannot be negative")

        await db.insert(services).values({
            salonId,
            name: name.trim(),
            duration: Number(duration),
            price: Number(price),
        })

        // Return all services for this salon
        const all = await db.select().from(services).where(eq(services.salonId, salonId))
        return apiCreated(all)
    } catch (error) {
        console.error("[POST /api/salons/:id/services]", error)
        return apiError("Failed to create service", 500)
    }
}
