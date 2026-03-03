import { getDashboardAnalytics } from "@/app/actions/admin"
import StatsCard from "@/components/dashboard/stats-card"

export default async function SuperAdminDashboard() {
    const analytics = await getDashboardAnalytics()

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
                        value={analytics.totalUsers}
                    />
                    <StatsCard
                        icon="content_cut"
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                        label="Total Salons"
                        value={analytics.totalSalons}
                    />
                    <StatsCard
                        icon="calendar_month"
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                        label="Appointments"
                        value={analytics.totalAppointments}
                    />
                </div>
            </div>
        </div>
    )
}
