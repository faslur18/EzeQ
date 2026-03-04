import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// ─── Standard API response helpers ───────────────────────────────────────

export function apiSuccess<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status })
}

export function apiCreated<T>(data: T) {
    return NextResponse.json({ success: true, data }, { status: 201 })
}

export function apiError(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status })
}

// ─── Auth helpers ────────────────────────────────────────────────────────

export type AuthUser = {
    id: string
    name?: string | null
    email?: string | null
    role: string
}

/**
 * Get the authenticated user from the session.
 * Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
    const session = await getServerSession(authOptions)
    if (!session?.user) return null

    const user = session.user as any
    if (!user?.id) return null

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "CUSTOMER",
    }
}

/**
 * Require authentication. Returns the user or an error response.
 */
export async function requireAuth(): Promise<
    { user: AuthUser; error?: never } | { user?: never; error: NextResponse }
> {
    const user = await getAuthUser()
    if (!user) {
        return { error: apiError("Authentication required", 401) }
    }
    return { user }
}

/**
 * Require authentication AND one of the specified roles.
 * Returns the user or an appropriate error response.
 */
export async function requireRole(...roles: string[]): Promise<
    { user: AuthUser; error?: never } | { user?: never; error: NextResponse }
> {
    const auth = await requireAuth()
    if (auth.error) return auth

    if (!roles.includes(auth.user.role)) {
        return { error: apiError("Forbidden: insufficient permissions", 403) }
    }
    return { user: auth.user }
}
