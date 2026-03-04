"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Icon from "@/components/ui/icon"
import Modal from "@/components/ui/modal"

export default function CustomerDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login")
        }
    }, [status, router])

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white bg-nothing-grid">
                <div className="animate-pulse text-lg font-bold text-slate-900">Loading EzeQ...</div>
            </div>
        )
    }

    if (!session) return null

    const user = session.user as any

    return (
        <div className="min-h-screen bg-white bg-nothing-grid font-sans text-slate-900">
            {/* Header */}
            <header className="border-b-2 border-input bg-white">
                <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Icon name="spa" size="md" className="text-primary" />
                        EzeQ
                    </h1>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium hidden sm:inline-block">
                            Welcome, <span className="font-bold">{user?.name || user?.email}</span>
                        </span>
                        <button
                            onClick={() => setIsSignOutModalOpen(true)}
                            className="flex items-center justify-center gap-2 rounded-sm border-2 border-input bg-white px-4 py-2 text-sm font-bold text-slate-900 transition-colors hover:border-black hover:bg-slate-50"
                        >
                            <Icon name="logout" size="sm" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
                <div className="mb-10">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                        Your Dashboard
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">Browse salons, book services, and manage your appointments.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Browse Salons */}
                    <Link href="/salons" className="group block h-full">
                        <div className="flex h-full flex-col justify-between rounded-none border-2 border-input bg-white p-6 transition-all hover:border-black hover:-translate-y-1">
                            <div>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-black text-white group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Icon name="storefront" size="lg" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900">Browse Salons</h3>
                                <p className="text-slate-500 text-sm">
                                    Find and explore top-rated salons, barbershops, and spas near you.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                View Salons <Icon name="arrow_forward" size="sm" className="ml-1" />
                            </div>
                        </div>
                    </Link>

                    {/* My Appointments */}
                    <Link href="/appointments" className="group block h-full">
                        <div className="flex h-full flex-col justify-between rounded-none border-2 border-input bg-white p-6 transition-all hover:border-black hover:-translate-y-1">
                            <div>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-slate-200 text-black group-hover:bg-black group-hover:text-white transition-colors">
                                    <Icon name="event_note" size="lg" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900">My Appointments</h3>
                                <p className="text-slate-500 text-sm">
                                    View your upcoming bookings, reschedule, or review past appointments.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                View Schedule <Icon name="arrow_forward" size="sm" className="ml-1" />
                            </div>
                        </div>
                    </Link>

                    {/* Profile */}
                    <Link href="/profile" className="group block h-full">
                        <div className="flex h-full flex-col justify-between rounded-none border-2 border-input bg-white p-6 transition-all hover:border-black hover:-translate-y-1">
                            <div>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 text-slate-600 group-hover:bg-black group-hover:text-white transition-colors">
                                    <Icon name="person" size="lg" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900">My Profile</h3>
                                <p className="text-slate-500 text-sm">
                                    Manage your account settings, contact information, and preferences.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                Edit Profile <Icon name="arrow_forward" size="sm" className="ml-1" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Account Info Panel */}
                <div className="mt-10 rounded-none border-2 border-input bg-white p-8">
                    <h3 className="mb-6 text-xl font-bold text-slate-900">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Name</span>
                            <span className="text-lg font-bold text-slate-900">{user?.name || "—"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</span>
                            <span className="text-lg font-bold text-slate-900">{user?.email}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Account Type</span>
                            <span className="inline-flex max-w-fit items-center rounded-sm bg-black px-3 py-1 text-sm font-bold text-white">
                                {user?.role || "CUSTOMER"}
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Reusable Sign Out Modal */}
            <Modal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                icon="logout"
                iconBg="bg-red-100"
                iconColor="text-destructive"
                title="Sign Out"
                description="Are you sure you want to sign out of your EzeQ account?"
                primaryActionText="Yes, Sign Out"
                primaryActionOnClick={() => signOut({ callbackUrl: "/auth/login" })}
                primaryActionClassName="bg-destructive hover:bg-destructive/90 text-white border-destructive rounded-sm"
                secondaryActionText="Cancel"
                secondaryActionOnClick={() => setIsSignOutModalOpen(false)}
            />
        </div>
    )
}
