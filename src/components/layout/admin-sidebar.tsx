"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Icon from "@/components/ui/icon"
import PrimaryButton from "@/components/ui/primary-button"
import Modal from "@/components/ui/modal"
import { logout } from "@/store/authSlice"

interface NavItem {
    icon: string
    label: string
    href: string
    active?: boolean
}

interface AdminSidebarProps {
    salonName: string
    activePath: string
}

const navItems: Omit<NavItem, "active">[] = [
    { icon: "dashboard", label: "Dashboard", href: "/admin/dashboard" },
    { icon: "content_cut", label: "Services", href: "/admin/salon-services" },
    { icon: "event", label: "Schedule", href: "/admin/schedules" },
    { icon: "storefront", label: "Salon Profile", href: "/admin/salon-profile" },
]

const bottomItems = [
    { icon: "person", label: "Personal Profile", href: "/profile" }
]

export default function AdminSidebar({ salonName, activePath }: AdminSidebarProps) {
    const dispatch = useDispatch()
    const router = useRouter()
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

    const handleSignOut = () => {
        dispatch(logout())
        router.push("/auth/login")
    }

    return (
        <>
            <aside className="hidden w-64 flex-col border-r-2 border-input bg-white md:flex">
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <Icon name="spa" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold leading-tight text-slate-900">{salonName}</h1>
                        <p className="text-xs font-medium text-slate-500">Admin Panel</p>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isActive = activePath === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon name={item.icon} size="md" filled={isActive} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom Settings */}
                    <div className="mt-auto">
                        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Settings</div>
                        <nav className="flex flex-col gap-1">
                            {bottomItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group flex items-center gap-3 rounded-sm px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-black transition-colors"
                                >
                                    <Icon name={item.icon} size="md" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            ))}
                            <button
                                onClick={() => setIsSignOutModalOpen(true)}
                                className="group flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-colors text-left"
                            >
                                <Icon name="logout" size="md" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="border-t-2 border-input p-4">
                    <div className="flex items-center gap-3 rounded-sm bg-slate-50 p-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
                            {(salonName || "S").substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-semibold text-slate-900">{salonName}</span>
                            <span className="truncate text-xs text-slate-500">Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Sign Out Modal Overlay */}
            <Modal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                icon="logout"
                iconBg="bg-red-100"
                iconColor="text-destructive"
                title="Sign Out"
                description="Are you sure you want to sign out of your account?"
                primaryActionText="Yes, Sign Out"
                primaryActionOnClick={handleSignOut}
                primaryActionClassName="bg-destructive hover:bg-destructive/90 text-white border-destructive"
                secondaryActionText="Cancel"
                secondaryActionOnClick={() => setIsSignOutModalOpen(false)}
                hideCloseButton
            />
        </>
    )
}
