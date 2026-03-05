"use client"

import { useGetUsersQuery } from "@/store/services/usersApi"
import { useGetAdminSalonsQuery } from "@/store/services/adminSalonsApi"
import { useGetAppointmentsQuery } from "@/store/services/appointmentsApi"
import StatsCard from "@/components/dashboard/stats-card"
import AuthGuard from "@/components/auth/AuthGuard"

function SuperAdminDashboardContent() {
    const { data: users = [] } = useGetUsersQuery()
    const { data: salons = [] } = useGetAdminSalonsQuery()
    const { data: appointments = [] } = useGetAppointmentsQuery()

    return (
        <div className="min-h-screen bg-[#f6f6f8] p-6 md:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Super Admin Dashboard</h1>
                    <p className="text-sm text-slate-500">Platform-wide analytics overview.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatsCard
                        icon="people"
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                        label="Total Users"
                        value={users.length}
                    />
                    <StatsCard
                        icon="content_cut"
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                        label="Total Salons"
                        value={salons.length}
                    />
                    <StatsCard
                        icon="calendar_month"
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                        label="Appointments"
                        value={appointments.length}
                    />
                </div>
            </div>
        </div>
    )
}

export default function SuperAdminDashboard() {
    return (
        <AuthGuard allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminDashboardContent />
        </AuthGuard>
    )
}
