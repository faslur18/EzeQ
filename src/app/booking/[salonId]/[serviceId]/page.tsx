"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter, useParams } from "next/navigation"
import { CustomCalendar } from "@/components/ui/CustomCalendar"
import BackButton from "@/components/ui/BackButton"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import Modal from "@/components/ui/modal"
import Header from "@/components/layout/Header"
import { RootState } from "@/store/store"
import { logout } from "@/store/authSlice"
import { useGetHoursQuery } from "@/store/services/hoursApi"
import { useGetServiceByIdQuery } from "@/store/services/servicesApi"
import { useGetSalonByIdQuery } from "@/store/services/salonsApi"
import { useGetAppointmentsQuery, useCreateAppointmentMutation } from "@/store/services/appointmentsApi"
import AuthGuard from "@/components/auth/AuthGuard"

function BookingContent() {
    const router = useRouter()
    const dispatch = useDispatch()
    const params = useParams()
    const salonId = params.salonId as string
    const serviceId = params.serviceId as string

    const user = useSelector((state: RootState) => state.auth.user)
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [slots, setSlots] = useState<string[]>([])
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [bookingLoading, setBookingLoading] = useState(false)

    // Fetch dependencies
    const { data: salon } = useGetSalonByIdQuery(salonId)
    const { data: service } = useGetServiceByIdQuery({ salonId, id: serviceId })
    const { data: hours = [] } = useGetHoursQuery(salonId)
    const { data: appointments = [] } = useGetAppointmentsQuery()
    const [createAppointment] = useCreateAppointmentMutation()

    const handleSignOut = () => {
        dispatch(logout())
        router.push("/auth/login")
    }

    // Generate time slots client-side
    useEffect(() => {
        if (!date || !service || !hours.length) {
            setSlots([])
            return
        }

        setLoading(true)
        setSelectedSlot(null)

        const dayOfWeek = date.getDay()
        const dayHours = hours.find((h) => h.dayOfWeek === dayOfWeek)

        if (!dayHours) {
            setSlots([])
            setLoading(false)
            return
        }

        const offset = date.getTimezoneOffset()
        const localDate = new Date(date.getTime() - (offset * 60 * 1000))
        const dateStr = localDate.toISOString().split("T")[0]

        const [openH, openM] = dayHours.openTime.split(":").map(Number)
        const [closeH, closeM] = dayHours.closeTime.split(":").map(Number)

        const openMinutes = openH * 60 + openM
        const closeMinutes = closeH * 60 + closeM
        const duration = service.duration

        const now = new Date()
        const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60 * 1000)).toISOString().split("T")[0]
        const isToday = dateStr === todayStr
        const currentMinutes = now.getHours() * 60 + now.getMinutes()

        const dayAppts = (appointments as any[]).filter(
            (a) => a.appointmentDate === dateStr && a.salonId === salonId && a.status !== "CANCELLED"
        )

        const availableSlots: string[] = []
        for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
            if (isToday && m < currentMinutes) continue

            const slotStart = m
            const slotEnd = m + duration

            const isOverlapping = dayAppts.some((appt: any) => {
                const [aH, aM] = (appt.startTime || "00:00").split(":").map(Number)
                const apptStart = aH * 60 + aM
                const apptDuration = appt.service?.duration || 30
                const apptEnd = apptStart + apptDuration
                return slotStart < apptEnd && apptStart < slotEnd
            })

            if (!isOverlapping) {
                const hours = Math.floor(m / 60)
                const mins = m % 60
                availableSlots.push(
                    `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
                )
            }
        }

        setSlots(availableSlots)
        setLoading(false)
    }, [date, service, hours, appointments, salonId])

    const handleBooking = async () => {
        if (!user || !selectedSlot || !date) return
        setBookingLoading(true)

        try {
            const offset = date.getTimezoneOffset()
            const localDate = new Date(date.getTime() - (offset * 60 * 1000))
            const localDateStr = localDate.toISOString().split("T")[0]

            await createAppointment({
                salonId,
                serviceId,
                appointmentDate: localDateStr,
                startTime: selectedSlot,
            }).unwrap()

            router.push("/dashboard")
        } catch (error) {
            console.error("Booking error:", error)
        } finally {
            setBookingLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white bg-nothing-grid font-sans text-slate-900">
            <Header user={user} onSignOut={() => setIsSignOutModalOpen(true)} />

            <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
                <div className="mb-10 flex flex-col gap-6">
                    <BackButton label="Back to Salon" />
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                            Complete Your Booking
                        </h2>
                        <p className="text-lg text-slate-500 font-medium font-sans">
                            {service ? `Booking ${service.name} at ${salon?.name}` : "Pick a date and choose an available time slot."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Selection Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Step 1: Date Selection */}
                        <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center bg-black text-white text-sm">1</span>
                                Select Date
                            </h3>
                            <div className="w-full">
                                <CustomCalendar
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(d: Date) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </div>
                        </div>

                        {/* Step 2: Time Selection */}
                        <div className="border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center bg-black text-white text-sm">2</span>
                                Available Time Slots
                            </h3>

                            {loading ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <div className="h-10 w-10 border-4 border-t-black border-r-transparent animate-spin"></div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Finding matches...</p>
                                </div>
                            ) : slots.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-3 px-4 font-bold border-2 transition-all text-sm ${selectedSlot === slot
                                                ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                                                : "bg-white text-slate-900 border-input hover:border-black"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 border-2 border-dashed border-input bg-slate-50 text-center">
                                    <Icon name="event_busy" size="xl" className="text-slate-300 mb-2" />
                                    <p className="font-bold text-slate-400">No available slots for this date.</p>
                                    <p className="text-xs text-slate-400 font-medium">Try selecting another day.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-[100px]">
                            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Booking Summary</h3>

                            <div className="space-y-6 mb-8">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-slate-100 flex items-center justify-center shrink-0">
                                        <Icon name="store" size="sm" className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salon</p>
                                        <p className="font-bold text-slate-900 leading-tight">{salon?.name || "..."}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-slate-100 flex items-center justify-center shrink-0">
                                        <Icon name="content_cut" size="sm" className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</p>
                                        <p className="font-bold text-slate-900 leading-tight">{service?.name || "..."}</p>
                                        <p className="text-xs text-slate-500 font-medium">{service?.duration} mins • ${service?.price}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-10 w-10 bg-slate-100 flex items-center justify-center shrink-0">
                                        <Icon name="calendar_today" size="sm" className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                                        <p className="font-bold text-slate-900 leading-tight">
                                            {date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-sm font-black text-black">
                                            {selectedSlot ? `@ ${selectedSlot}` : "Select a time"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={!selectedSlot || loading || bookingLoading}
                                onClick={handleBooking}
                                className="w-full bg-black text-white py-4 font-black text-lg uppercase tracking-tight hover:bg-black/90 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {bookingLoading ? "Confirming..." : "Confirm Booking"}
                                <Icon name="check_circle" size="md" className="group-hover:scale-110 transition-transform" />
                            </button>

                            {!selectedSlot && (
                                <p className="mt-4 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Pick a time slot to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Modal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                icon="logout"
                iconBg="bg-red-100"
                iconColor="text-destructive"
                title="Sign Out"
                description="Are you sure you want to sign out?"
                primaryActionText="Yes, Sign Out"
                primaryActionOnClick={handleSignOut}
                primaryActionClassName="bg-destructive hover:bg-destructive/90 text-white border-destructive rounded-sm"
                secondaryActionText="Cancel"
                secondaryActionOnClick={() => setIsSignOutModalOpen(false)}
            />
        </div>
    )
}

export default function BookingPage() {
    return (
        <AuthGuard allowedRoles={["CUSTOMER"]}>
            <BookingContent />
        </AuthGuard>
    )
}
