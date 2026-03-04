import { db } from "@/db"
import { salons, services, operatingHours } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { apiSuccess, apiCreated, apiError, requireAuth, requireRole } from "@/lib/api-utils"

// GET /api/salons — List all approved salons (public)
export async function GET() {
    try {
        const result = await db
            .select()
            .from(salons)
            .where(and(eq(salons.status, "APPROVED"), eq(salons.isActive, true)))
            .orderBy(desc(salons.rating))

        return apiSuccess(result)
    } catch (error) {
        console.error("[GET /api/salons]", error)
        return apiError("Failed to fetch salons", 500)
    }
}

// POST /api/salons — Create a new salon (SALON_ADMIN only)
export async function POST(req: Request) {
    try {
        const auth = await requireRole("SALON_ADMIN")
        if (auth.error) return auth.error

        const body = await req.json()
        const { name, address } = body

        if (!name?.trim() || !address?.trim()) {
            return apiError("Salon name and address are required")
        }

        // Check if admin already has a salon
        const existing = await db
            .select()
            .from(salons)
            .where(eq(salons.adminId, auth.user.id))

        if (existing.length > 0) {
            return apiError("You already have a salon registered. Update it instead.", 409)
        }

        await db.insert(salons).values({
            adminId: auth.user.id,
            name: name.trim(),
            address: address.trim(),
            rating: 0,
            isActive: true,
            status: "PENDING",
        })

        const created = await db
            .select()
            .from(salons)
            .where(eq(salons.adminId, auth.user.id))

        return apiCreated(created[0])
    } catch (error) {
        console.error("[POST /api/salons]", error)
        return apiError("Failed to create salon", 500)
    }
}
