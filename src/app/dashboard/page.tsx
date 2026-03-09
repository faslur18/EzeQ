"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Icon from "@/components/ui/icon"
import Modal from "@/components/ui/modal"
import { useState, useEffect } from "react"
import { RootState } from "@/store/store"
import { logout } from "@/store/authSlice"
import AuthGuard from "@/components/auth/AuthGuard"
import SalonCard from "@/components/dashboard/SalonCard"
import Header from "@/components/layout/Header"

import { useGetSalonsQuery } from "@/store/services/salonsApi"

function CustomerDashboardContent() {
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state: RootState) => state.auth.user)
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState("")
    const [locationFilter, setLocationFilter] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [debouncedLocation, setDebouncedLocation] = useState("")

    // Simple debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setDebouncedLocation(locationFilter)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, locationFilter])

    const { data: salons = [], isLoading, error } = useGetSalonsQuery({
        name: debouncedSearch,
        address: debouncedLocation
    })

    const handleSignOut = () => {
        dispatch(logout())
        router.push("/auth/login")
    }

    return (
        <div className="min-h-screen bg-white bg-nothing-grid font-sans text-slate-900">
            {/* Reusable Header */}
            <Header user={user} onSignOut={() => setIsSignOutModalOpen(true)} />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
                <div className="mb-10">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                        Find Your Perfect Salon
                    </h2>
                    <p className="text-lg text-slate-500 font-medium font-sans">Browse top-rated salons and book your next appointment.</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icon name="search" size="sm" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search salons by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border-2 border-input bg-white font-bold text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        />
                    </div>
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icon name="location_on" size="sm" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by location/address..."
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border-2 border-input bg-white font-bold text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-80 w-full animate-pulse border-2 border-slate-100 bg-slate-50 rounded-none"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-none border-2 border-red-200 bg-red-50 p-8 text-center">
                        <Icon name="error" size="xl" className="text-red-400 mb-4" />
                        <h3 className="text-xl font-bold text-red-900 mb-2">Something went wrong</h3>
                        <p className="text-red-600 font-medium">Unable to load salons. Please try again later.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 font-bold text-red-900 underline hover:no-underline"
                        >
                            Try refreshing the page
                        </button>
                    </div>
                ) : salons.length === 0 ? (
                    <div className="rounded-none border-2 border-input bg-white p-12 text-center">
                        <Icon name="search_off" size="xl" className="text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Salons Found</h3>
                        <p className="text-slate-500 font-medium">We couldn't find any salons matching your search criteria.</p>
                        {(searchQuery || locationFilter) && (
                            <button
                                onClick={() => {
                                    setSearchQuery("")
                                    setLocationFilter("")
                                }}
                                className="mt-4 font-bold text-primary underline hover:no-underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {salons.map((salon) => (
                            <SalonCard
                                key={salon.id}
                                id={salon.id}
                                name={salon.name}
                                address={salon.address}
                                rating={salon.rating || 0}
                                profileImage={salon.profileImage || undefined}
                            />
                        ))}
                    </div>
                )}
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

export default function CustomerDashboard() {
    return (
        <AuthGuard allowedRoles={["CUSTOMER"]}>
            <CustomerDashboardContent />
        </AuthGuard>
    )
}
