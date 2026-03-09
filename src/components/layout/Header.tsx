"use client"

import Link from "next/link"
import Icon from "@/components/ui/icon"
import UserDropdown from "./UserDropdown"
import { AuthUser } from "@/store/authSlice"

interface HeaderProps {
    user: AuthUser | null
    onSignOut: () => void
}

export default function Header({ user, onSignOut }: HeaderProps) {
    return (
        <header className="border-b-2 border-input bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Icon name="spa" size="md" className="text-primary" />
                        EzeQ
                    </h1>
                </Link>

                <div className="flex items-center gap-4">
                    <UserDropdown user={user} onSignOut={onSignOut} />
                </div>
            </div>
        </header>
    )
}
