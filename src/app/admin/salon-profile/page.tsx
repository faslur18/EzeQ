"use client"

import React from 'react'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import AdminSidebar from '@/components/layout/admin-sidebar'
import DashboardHeader from '@/components/layout/dashboard-header'
import Icon from '@/components/ui/icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetMySalonQuery } from '@/store/services/salonsApi'

function SalonProfileContent() {
    const { data: adminSalon, isLoading, isError, error } = useGetMySalonQuery();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="animate-pulse text-lg font-bold text-slate-900">Loading profile...</div>
            </div>
        )
    }

    if (!adminSalon || (isError && (error as any)?.status === 404)) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-white">
                <AdminSidebar salonName="My Salon" activePath="/admin/salon-profile" />
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
                                        <p className="text-sm text-slate-500">You haven't set up your salon profile yet.</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mb-6">
                                    Create your salon profile first to view its details here.
                                </p>
                                <Link href="/admin/salon" className="inline-flex items-center justify-center rounded-full bg-primary py-2.5 px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
                                    Setup Shop Details
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            <AdminSidebar salonName={adminSalon.name} activePath="/admin/salon-profile" />

            <main className="flex flex-1 py-4 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
                <DashboardHeader
                    title="Salon Profile"
                    subtitle="Manage your public-facing salon details."
                    mobileName={adminSalon.name}
                />

                <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto w-full">

                    {/* Cover Banner & Quick Info */}
                    <div className="relative rounded-sm overflow-hidden bg-white border-2 border-input shadow-sm">

                        {/* Banner Image Placeholder */}
                        <div className="h-48 md:h-64 w-full bg-slate-200 relative overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1521590832167-7bfc17484d20?q=80&w=2070&auto=format&fit=crop"
                                alt="Salon Cover"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none" />
                            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors text-white text-sm font-semibold rounded-sm px-4 py-2 border border-white/30 flex items-center gap-2">
                                <Icon name="photo_camera" size="sm" />
                                Change Cover
                            </button>
                        </div>

                        {/* Top Info Section */}
                        <div className="px-6 md:px-10 pb-8 relative">
                            {/* Avatar/Logo Placeholder */}
                            <div className="absolute -top-16 border-4 border-white bg-white h-32 w-32 rounded-sm shadow-lg flex items-center justify-center overflow-hidden">
                                <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                                    <Icon name="storefront" className="text-primary text-5xl" />
                                </div>
                            </div>

                            <div className="pt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                                        {adminSalon.name}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="location_on" size="sm" className="text-primary" />
                                            {adminSalon.address || "No address provided"}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="star" size="sm" className="text-amber-500" />
                                            {adminSalon.rating} Rating
                                        </div>
                                        {adminSalon.status === "APPROVED" ? (
                                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-sm">
                                                <Icon name="check_circle" size="sm" />
                                                Approved
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-sm">
                                                <Icon name="pending" size="sm" />
                                                Pending Approval
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link href="/admin/salon">
                                        <button className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-sm shadow-sm transition-colors flex items-center gap-2">
                                            <Icon name="edit" size="sm" />
                                            Edit Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Business Details */}
                        <div className="lg:col-span-2 space-y-8">

                            <Card className="p-0">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-indigo-50 text-indigo-600 h-10 w-10 rounded-sm flex items-center justify-center">
                                            <Icon name="info" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">About the Salon</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        Welcome to {adminSalon.name}. We are dedicated to providing the best styling and grooming services.
                                        Our experienced professionals ensure you leave looking and feeling your absolute best.
                                        Book an appointment today to experience premium service in a relaxing environment.
                                        {/* Ideally fetched from backend description field */}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="p-0">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-rose-50 text-rose-600 h-10 w-10 rounded-sm flex items-center justify-center">
                                            <Icon name="photo_library" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Gallery Highlights</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[
                                            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1516975080661-46bfddba1361?q=80&w=600&auto=format&fit=crop"
                                        ].map((img, i) => (
                                            <div key={i} className="aspect-square rounded-sm border-2 border-input overflow-hidden group cursor-pointer">
                                                <img src={img} alt="Gallery image" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Right Column: Contact & Quick Stats */}
                        <div className="space-y-8">

                            <Card className="p-0">
                                <CardHeader className="p-6 pb-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <Icon name="contacts" className="text-slate-400" />
                                        Contact Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-4">
                                    <ul className="space-y-5">
                                        <li className="flex items-start gap-4">
                                            <div className="mt-0.5 text-slate-400"><Icon name="location_on" size="sm" /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Address</p>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed mt-0.5">{adminSalon.address || "No address"}</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="mt-0.5 text-slate-400"><Icon name="call" size="sm" /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Phone</p>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed mt-0.5">+1 (555) 000-0000</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="mt-0.5 text-slate-400"><Icon name="mail" size="sm" /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Email</p>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed mt-0.5">contact@salon.com</p>
                                            </div>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-2 border-primary/20 p-0 overflow-hidden shadow-none">
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                    <div className="bg-white p-3 rounded-sm shadow-sm mb-4 border-2 border-primary/10">
                                        <Icon name="share" size="xl" className="text-primary" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2">Share Your Profile</h4>
                                    <p className="text-sm text-slate-600 font-medium mb-5">
                                        Share your unique salon link with customers on social media.
                                    </p>
                                    <div className="flex flex-col w-full gap-2">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/salons/${adminSalon.id}`);
                                                alert("Link copied to clipboard!");
                                            }}
                                            className="w-full bg-white border-2 border-input hover:border-black text-slate-900 font-bold py-2.5 rounded-sm text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Icon name="content_copy" size="sm" />
                                            Copy Link
                                        </button>
                                        
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

export default function SalonProfilePage() {
    return (
        <AuthGuard allowedRoles={["SALON_ADMIN"]}>
            <SalonProfileContent />
        </AuthGuard>
    )
}