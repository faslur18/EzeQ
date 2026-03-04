import { db } from "@/db"
import { salons, users } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { apiSuccess, apiError, requireRole } from "@/lib/api-utils"

// GET /api/admin/salons — List all salons with owner info (SUPER_ADMIN only)
export async function GET() {
    try {
        const auth = await requireRole("SUPER_ADMIN")
        if (auth.error) return auth.error

        const result = await db
            .select({
                id: salons.id,
                name: salons.name,
                address: salons.address,
                rating: salons.rating,
                isActive: salons.isActive,
                status: salons.status,
                adminId: salons.adminId,
                adminName: users.name,
                adminEmail: users.email,
            })
            .from(salons)
            .leftJoin(users, eq(salons.adminId, users.id))
            .orderBy(asc(salons.status))

        return apiSuccess(result)
    } catch (error) {
        console.error("[GET /api/admin/salons]", error)
        return apiError("Failed to fetch salons", 500)
    }
}
