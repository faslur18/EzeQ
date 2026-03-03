import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Route → allowed roles mapping
const protectedRoutes: Record<string, string[]> = {
    "/admin": ["SALON_ADMIN"],
    "/superadmin": ["SUPER_ADMIN"],
    "/dashboard": ["CUSTOMER"],
    "/appointments": ["CUSTOMER"],
    "/booking": ["CUSTOMER"],
}

// Routes that require NO session (redirect away if already logged in)
const authRoutes = ["/auth/login", "/auth/register"]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const isLoggedIn = !!token
    const userRole = (token?.role as string) || ""

    // ─── Auth pages: redirect logged-in users to their dashboard ───
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        if (isLoggedIn) {
            const dashboardUrl = getDashboardForRole(userRole)
            return NextResponse.redirect(new URL(dashboardUrl, request.url))
        }
        return NextResponse.next()
    }

    // ─── Protected routes: check auth + role ───
    for (const [routePrefix, allowedRoles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(routePrefix)) {
            // Not logged in → redirect to login
            if (!isLoggedIn) {
                const loginUrl = new URL("/auth/login", request.url)
                loginUrl.searchParams.set("callbackUrl", pathname)
                return NextResponse.redirect(loginUrl)
            }

            // Logged in but wrong role → redirect to correct dashboard
            if (!allowedRoles.includes(userRole)) {
                const correctDashboard = getDashboardForRole(userRole)
                return NextResponse.redirect(new URL(correctDashboard, request.url))
            }

            return NextResponse.next()
        }
    }

    return NextResponse.next()
}

function getDashboardForRole(role: string): string {
    switch (role) {
        case "SUPER_ADMIN":
            return "/superadmin/dashboard"
        case "SALON_ADMIN":
            return "/admin/dashboard"
        default:
            return "/dashboard"
    }
}

// Only run middleware on these paths (skip API routes, static files, etc.)
export const config = {
    matcher: [
        "/admin/:path*",
        "/superadmin/:path*",
        "/dashboard/:path*",
        "/dashboard",
        "/appointments/:path*",
        "/booking/:path*",
        "/auth/:path*",
    ],
}
