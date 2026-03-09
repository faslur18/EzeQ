"use client"

import { useParams, useRouter } from "next/navigation"
import { useGetSalonByIdQuery } from "@/store/services/salonsApi"
import { useGetServicesQuery } from "@/store/services/servicesApi"
import Icon from "@/components/ui/icon"
import Modal from "@/components/ui/modal"
import ServiceCard from "@/components/salon/ServiceCard"
import Header from "@/components/layout/Header"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/store/authSlice"
import { RootState } from "@/store/store"
import AuthGuard from "@/components/auth/AuthGuard"
import Link from "next/link"
import BackButton from "@/components/ui/BackButton"

function SalonDetailsContent() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch()
    const id = params.id as string

    const user = useSelector((state: RootState) => state.auth.user)
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

    const { data: salon, isLoading: isSalonLoading, error: salonError } = useGetSalonByIdQuery(id)
    const { data: services = [], isLoading: isServicesLoading } = useGetServicesQuery(id)

    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

    const handleSignOut = () => {
        dispatch(logout())
        router.push("/auth/login")
    }

    if (isSalonLoading || isServicesLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-none border-4 border-t-black border-r-transparent animate-spin mb-4"></div>
                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Loading Salon...</p>
                </div>
            </div>
        )
    }

    if (salonError || !salon) {
        return (
            <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center text-center">
                <Icon name="error" size="xl" className="text-red-400 mb-4" />
                <h1 className="text-3xl font-black text-slate-900 mb-2">Salon Not Found</h1>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                    The salon you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/dashboard" className="border-2 border-black px-6 py-3 font-bold hover:bg-slate-50 transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Reusable Header */}
            <Header user={user} onSignOut={() => setIsSignOutModalOpen(true)} />

            {/* Hero Section */}
            <div className="relative h-[300px] w-full bg-slate-100 overflow-hidden border-b-2 border-input group/hero">
                {/* Floating Back Navigation */}
                <div className="absolute top-6 left-4 lg:left-8 z-20">
                    <BackButton
                        label="Back"
                        className="opacity-90 hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 pr-3 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white"
                    />
                </div>
                {salon.coverImage ? (
                    <img src={salon.coverImage} alt={salon.name} className="h-full w-full object-cover opacity-80" />
                ) : (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] opacity-50"></div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-white via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 lg:px-8 pb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 md:h-32 md:w-32 bg-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                                {salon.profileImage ? (
                                    <img src={salon.profileImage} alt={salon.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-300">
                                        <Icon name="palette" size="xl" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">
                                    {salon.name}
                                </h2>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-1 bg-black text-white px-2 py-1 text-xs font-black">
                                        <Icon name="star" size="sm" className="text-yellow-400 filled" />
                                        {salon.rating.toFixed(1)}
                                    </div>
                                    <div className="text-sm font-bold text-slate-500 flex items-center gap-1">
                                        <Icon name="location_on" size="sm" />
                                        {salon.address}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <main className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Services Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                <Icon name="content_cut" size="md" />
                                Available Services
                            </h3>
                            <p className="text-slate-500 font-medium">Select a service to start your booking.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {services.length === 0 ? (
                                <div className="border-2 border-dashed border-input p-12 text-center bg-slate-50">
                                    <Icon name="sentiment_dissatisfied" size="xl" className="text-slate-300 mb-2" />
                                    <p className="font-bold text-slate-400">No services listed yet.</p>
                                </div>
                            ) : (
                                services.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        id={service.id}
                                        name={service.name}
                                        duration={service.duration}
                                        price={service.price}
                                        isSelected={selectedServiceId === service.id}
                                        onSelect={(id) => setSelectedServiceId((prev) => prev === id ? null : id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-8">
                        {/* Booking CTA */}
                        <div className="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black text-slate-900 mb-4">Ready to book?</h3>
                            <button
                                disabled={!selectedServiceId}
                                onClick={() => router.push(`/booking/${id}/${selectedServiceId}`)}
                                className="w-full bg-black text-white py-4 font-black text-lg uppercase tracking-tight hover:bg-primary transition-all disabled:bg-slate-200 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                            >
                                Continue to Booking
                                <Icon name="arrow_forward" size="md" className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            {!selectedServiceId ? (
                                <p className="mt-4 text-xs text-center font-bold text-slate-400 uppercase tracking-widest">
                                    Pick a service first
                                </p>
                            ) : (
                                <p className="mt-4 text-xs text-center font-bold text-slate-400 uppercase tracking-widest">
                                    Selected: {services.find((s) => s.id === selectedServiceId)?.name}
                                </p>
                            )}
                        </div>

                        {/* About Section */}
                        <div className="border-2 border-input p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Icon name="info" size="sm" />
                                About the Salon
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                {salon.description || "No description available for this salon."}
                            </p>
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 flex items-center justify-center">
                                        <Icon name="call" size="sm" className="text-slate-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">
                                        {salon.contactPhone || "No phone listed"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-100 flex items-center justify-center">
                                        <Icon name="mail" size="sm" className="text-slate-400" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">
                                        {salon.contactEmail || "No email listed"}
                                    </span>
                                </div>
                            </div>
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
                primaryActionOnClick={handleSignOut}
                primaryActionClassName="bg-destructive hover:bg-destructive/90 text-white border-destructive rounded-sm"
                secondaryActionText="Cancel"
                secondaryActionOnClick={() => setIsSignOutModalOpen(false)}
            />
        </div>
    )
}

export default function SalonDetailsPage() {
    return (
        <AuthGuard allowedRoles={["CUSTOMER"]}>
            <SalonDetailsContent />
        </AuthGuard>
    )
}
