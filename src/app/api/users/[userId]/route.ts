import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { apiSuccess, apiError, requireRole } from "@/lib/api-utils"

type RouteContext = { params: Promise<{ userId: string }> }

// GET /api/users/[userId] — Get user details (SUPER_ADMIN only)
export async function GET(_req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SUPER_ADMIN")
        if (auth.error) return auth.error

        const { userId } = await context.params

        const result = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, userId))

        if (result.length === 0) return apiError("User not found", 404)
        return apiSuccess(result[0])
    } catch (error) {
        console.error("[GET /api/users/:id]", error)
        return apiError("Failed to fetch user", 500)
    }
}

// PATCH /api/users/[userId] — Update user role (SUPER_ADMIN only)
export async function PATCH(req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SUPER_ADMIN")
        if (auth.error) return auth.error

        const { userId } = await context.params

        const userArr = await db.select().from(users).where(eq(users.id, userId))
        if (userArr.length === 0) return apiError("User not found", 404)

        // Prevent self-demotion
        if (userId === auth.user.id) return apiError("Cannot modify your own role")

        const body = await req.json()
        const { role } = body

        if (!role || !["CUSTOMER", "SALON_ADMIN", "SUPER_ADMIN"].includes(role)) {
            return apiError("Valid role required: CUSTOMER, SALON_ADMIN, or SUPER_ADMIN")
        }

        await db.update(users).set({ role }).where(eq(users.id, userId))

        const updated = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, userId))

        return apiSuccess(updated[0])
    } catch (error) {
        console.error("[PATCH /api/users/:id]", error)
        return apiError("Failed to update user", 500)
    }
}

// DELETE /api/users/[userId] — Delete user (SUPER_ADMIN only)
export async function DELETE(_req: Request, context: RouteContext) {
    try {
        const auth = await requireRole("SUPER_ADMIN")
        if (auth.error) return auth.error

        const { userId } = await context.params

        // Prevent self-deletion
        if (userId === auth.user.id) return apiError("Cannot delete your own account")

        const userArr = await db.select().from(users).where(eq(users.id, userId))
        if (userArr.length === 0) return apiError("User not found", 404)

        await db.delete(users).where(eq(users.id, userId))

        return apiSuccess({ message: "User deleted" })
    } catch (error) {
        console.error("[DELETE /api/users/:id]", error)
        return apiError("Failed to delete user", 500)
    }
}
