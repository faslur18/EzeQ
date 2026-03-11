"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { RootState } from "@/store/store"

type GuestGuardProps = {
    children: React.ReactNode
}

export default function GuestGuard({ children }: GuestGuardProps) {
    const router = useRouter()
    const { token, user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (token && user) {
            // Redirect to correct dashboard based on role
            switch (user.role) {
                case "SUPER_ADMIN":
                    router.replace("/superadmin/dashboard")
                    break
                case "SALON_ADMIN":
                    router.replace("/admin/dashboard")
                    break
                default:
                    router.replace("/dashboard")
            }
        }
    }, [token, user, router])

    if (token && user) return null

    return <>{children}</>
}
