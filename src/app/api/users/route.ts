import { db } from "@/db"
import { users } from "@/db/schema"
import { apiSuccess, apiError, requireRole } from "@/lib/api-utils"

// GET /api/users — List all users (SUPER_ADMIN only)
export async function GET() {
    try {
        const auth = await requireRole("SUPER_ADMIN")
        if (auth.error) return auth.error

        const result = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)

        return apiSuccess(result)
    } catch (error) {
        console.error("[GET /api/users]", error)
        return apiError("Failed to fetch users", 500)
    }
}
