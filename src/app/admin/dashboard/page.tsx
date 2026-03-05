"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useGetAppointmentsQuery } from "@/store/services/appointmentsApi"
import { useGetMySalonQuery } from "@/store/services/salonsApi"
import AdminSidebar from "@/components/layout/admin-sidebar"
import DashboardHeader from "@/components/layout/dashboard-header"
import StatsCard from "@/components/dashboard/stats-card"
import StatusBadge from "@/components/dashboard/status-badge"
import EmptyState from "@/components/dashboard/empty-state"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Icon from "@/components/ui/icon"
import AuthGuard from "@/components/auth/AuthGuard"

type DashboardAppointment = {
    id: string
    startTime: string
    appointmentDate: string
    status: string
    customer?: { name: string; email: string } | null
    service?: { name: string; duration: number } | null
}

function SalonAdminDashboardContent() {
    const user = useSelector((state: RootState) => state.auth.user)

    // Fetch the admin's salon directly
    const { data: adminSalon, isLoading: salonsLoading, isError, error } = useGetMySalonQuery()

    // Fetch appointments
    const { data: appointments = [], isLoading: apptsLoading } = useGetAppointmentsQuery()

    if (salonsLoading || apptsLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="animate-pulse text-lg font-bold text-slate-900">Loading dashboard...</div>
            </div>
        )
    }

    if (!adminSalon || (isError && (error as any)?.status === 404)) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-white">
                <AdminSidebar salonName="My Salon" activePath="/admin/dashboard" />
                <main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col gap-6 p-4 md:p-8">
                        <Card className="p-2 md:p-2">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-black text-white">
                                        <Icon name="storefront" size="lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Salon Setup Needed</h2>
                                        <p className="text-sm text-slate-500">Your salon admin account is active, but no salon profile is linked yet.</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mb-6">
                                    Create your salon profile first, then you will see appointments and business metrics here.
                                </p>
                                <Link href="/admin/add-profile-details" className="inline-flex items-center justify-center rounded-sm bg-primary py-2.5 px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
                                    Complete Shop Details
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    const todayStr = new Date().toISOString().split("T")[0]
    const todayAppointments = (appointments as DashboardAppointment[]).filter(
        (a) => a.appointmentDate === todayStr
    )
    const confirmedCount = todayAppointments.filter((a) => a.status === "CONFIRMED").length
    const pendingCount = todayAppointments.filter((a) => a.status === "PENDING").length

    const timelineColors = [
        "bg-black text-white ring-4 ring-white",
        "bg-slate-200 text-black ring-4 ring-white",
        "bg-primary text-primary-foreground ring-4 ring-white",
        "bg-transparent border-2 border-black text-black ring-4 ring-white",
        "bg-slate-800 text-white ring-4 ring-white",
    ]

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            <AdminSidebar salonName={adminSalon.name} activePath="/admin/dashboard" />

            <main className="flex flex-1 py-4 flex-col overflow-y-auto overflow-x-hidden bg-white">
                <DashboardHeader
                    title="Dashboard"
                    subtitle="Welcome back! Here's what's happening today."
                    mobileName={adminSalon.name}
                />

                <div className="flex flex-col gap-6 p-4 md:p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatsCard
                            icon="calendar_today"
                            iconBg="bg-slate-100"
                            iconColor="text-slate-900"
                            label="Today's Bookings"
                            value={todayAppointments.length}
                        />
                        <StatsCard
                            icon="check_circle"
                            iconBg="bg-slate-900"
                            iconColor="text-white"
                            label="Confirmed"
                            value={confirmedCount}
                            badge={confirmedCount > 0 ? { text: "Active", color: "text-white bg-slate-900" } : undefined}
                        />
                        <StatsCard
                            icon="schedule"
                            iconBg="bg-transparent border border-slate-300"
                            iconColor="text-slate-900"
                            label="Pending"
                            value={pendingCount}
                            badge={pendingCount > 0 ? { text: "Action", color: "text-primary bg-primary/10" } : undefined}
                        />
                    </div>

                    {/* Schedule & Quick Actions */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Today's Schedule */}
                        <Card className="lg:col-span-2 p-0 gap-0 overflow-hidden">
                            <div className="flex items-center justify-between border-b-2 border-input px-6 py-4 bg-slate-50">
                                <h3 className="text-lg font-bold text-slate-900">Today&apos;s Schedule</h3>
                                <span className="text-sm font-medium text-primary">
                                    {todayAppointments.length} appointment{todayAppointments.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <CardContent className="p-6">
                                {todayAppointments.length === 0 ? (
                                    <EmptyState
                                        icon="event_busy"
                                        title="No appointments scheduled for today."
                                        description="Enjoy your free time! 🎉"
                                    />
                                ) : (
                                    <div className="grid grid-cols-[48px_1fr] gap-x-4">
                                        {todayAppointments.map((item, index) => (
                                            <div key={item.id} className="contents">
                                                <div className="flex flex-col items-center">
                                                    {index === 0 && <div className="h-2 w-0.5 bg-slate-200"></div>}
                                                    {index > 0 && <div className="h-full w-0.5 bg-slate-200"></div>}
                                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${timelineColors[index % timelineColors.length]}`}>
                                                        <span className="text-xs font-bold text-slate-600">
                                                            {(item.customer?.name || item.customer?.email || "?").substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    {index < todayAppointments.length - 1 ? (
                                                        <div className="h-full w-0.5 bg-slate-200"></div>
                                                    ) : (
                                                        <div className="h-2 w-0.5 bg-slate-200"></div>
                                                    )}
                                                </div>
                                                <div className={index < todayAppointments.length - 1 ? "pb-4" : ""}>
                                                    <div className="flex flex-col rounded-sm border-2 border-input bg-transparent p-4 transition-colors hover:border-black sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900">{item.service?.name || "Service"}</h4>
                                                            <p className="text-sm text-slate-500">
                                                                {item.customer?.name || item.customer?.email || "Unknown customer"}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-3 sm:mt-0">
                                                            <div className="rounded-sm bg-black px-2.5 py-1 text-xs font-semibold text-white">
                                                                {item.startTime}
                                                            </div>
                                                            <StatusBadge status={item.status} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right Column */}
                        <div className="flex flex-col gap-6">
                            {/* Quick Actions */}
                            <div className="rounded-xl bg-primary p-6 text-white shadow-lg">
                                <h3 className="text-lg font-bold">Quick Actions</h3>
                                <p className="mb-6 text-sm text-blue-100 opacity-90">Manage your salon efficiently.</p>
                                <div className="flex flex-col gap-3">
                                    <Link href="/admin/salon-services" className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-3">
                                        <Icon name="content_cut" size="md" />
                                        Manage Services
                                    </Link>
                                    <Link href="/admin/schedules" className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-3">
                                        <Icon name="calendar_month" size="md" />
                                        Set Schedule
                                    </Link>
                                    <Link href="/admin/salon-profile" className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors flex items-center gap-3">
                                        <Icon name="storefront" size="md" />
                                        Shop Details
                                    </Link>
                                </div>
                            </div>

                            {/* Salon Info */}
                            <Card className="p-2 gap-2">
                                <CardHeader className="px-4 pt-4 pb-0">
                                    <CardTitle className="text-lg">Salon Info</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-indigo-50 text-indigo-600">
                                                <Icon name="storefront" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{adminSalon.name}</p>
                                                <p className="text-xs text-slate-500">{adminSalon.address || "No address set"}</p>
                                            </div>
                                        </div>
                                        <div className="h-px w-full bg-slate-200"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-teal-50 text-teal-600">
                                                <Icon name="content_cut" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{new Set(todayAppointments.map(a => a.service?.name).filter(Boolean)).size} Services Today</p>
                                                <p className="text-xs text-slate-500">Active service offerings</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SalonAdminDashboardPage() {
    return (
        <AuthGuard allowedRoles={["SALON_ADMIN"]}>
            <SalonAdminDashboardContent />
        </AuthGuard>
    )
}
