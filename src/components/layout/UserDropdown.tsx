"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Icon from "@/components/ui/icon"
import { AuthUser } from "@/store/authSlice"
import { cn } from "@/lib/utils"

interface UserDropdownProps {
    user: AuthUser | null
    onSignOut: () => void
}

export default function UserDropdown({ user, onSignOut }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => setIsOpen(!isOpen)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "?")

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-sm border-2 transition-all overflow-hidden bg-white hover:border-black",
                    isOpen ? "border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "border-input"
                )}
            >
                {/* Square Profile Image / Placeholder */}
                <div className="flex h-full w-full items-center justify-center font-black text-slate-800 bg-slate-50 uppercase tracking-tighter">
                    {userInitial}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                    <div className="p-4 border-b-2 border-slate-100">
                        <p className="text-sm font-black text-slate-900 truncate">
                            {user?.name || "User"}
                        </p>
                        <p className="text-xs font-medium text-slate-500 truncate">
                            {user?.email}
                        </p>
                    </div>
                    <div className="py-1">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Icon name="person" size="sm" />
                            Account Details
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Icon name="settings" size="sm" />
                            Settings
                        </Link>
                        <Link
                            href="/help"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-black transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Icon name="help" size="sm" />
                            Help Center
                        </Link>
                    </div>
                    <div className="border-t-2 border-slate-100 py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                onSignOut()
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Icon name="logout" size="sm" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
