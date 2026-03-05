"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { RootState } from "@/store/store"

type AuthGuardProps = {
    children: React.ReactNode
    allowedRoles?: string[]
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const router = useRouter()
    const { token, user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!token || !user) {
            router.push("/auth/login")
            return
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            // Redirect to correct dashboard based on role
            switch (user.role) {
                case "SUPER_ADMIN":
                    router.push("/superadmin/dashboard")
                    break
                case "SALON_ADMIN":
                    router.push("/admin/dashboard")
                    break
                default:
                    router.push("/dashboard")
            }
        }
    }, [token, user, allowedRoles, router])

    if (!token || !user) return null
    if (allowedRoles && !allowedRoles.includes(user.role)) return null

    return <>{children}</>
}
