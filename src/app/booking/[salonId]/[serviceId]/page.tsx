"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAvailableTimeSlots, createBooking } from "@/app/actions/booking"

export default function BookingPage() {
    const router = useRouter()
    const params = useParams()
    const salonId = params.salonId as string
    const serviceId = params.serviceId as string

    const { data: session, status } = useSession()

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [slots, setSlots] = useState<string[]>([])
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [bookingLoading, setBookingLoading] = useState(false)

    // Wait for session
    if (status === "unauthenticated") {
        // If we wanted to ensure login immediately, we could router.push("/login")
        // or handle in middleware. MVP relies on middleware protecting routes.
    }

    // Fetch slots whenever the date changes
    useEffect(() => {
        async function fetchSlots() {
            if (!date || !salonId || !serviceId) return
            setLoading(true)
            setSelectedSlot(null) // Reset selection
            try {
                const dateStr = date.toISOString().split("T")[0] // Simple YYYY-MM-DD formatting relative to UTC edge cases, better to use date-fns format if needed. 
                // For MVP, using standard toISOString split or localized formatting.
                const offset = date.getTimezoneOffset()
                const localDate = new Date(date.getTime() - (offset * 60 * 1000))
                const localDateStr = localDate.toISOString().split("T")[0]

                const availableSlots = await getAvailableTimeSlots(salonId, serviceId, localDateStr)
                setSlots(availableSlots)
            } catch (error) {
                console.error("Failed to fetch slots", error)
                setSlots([])
            } finally {
                setLoading(false)
            }
        }

        fetchSlots()
    }, [date, salonId, serviceId])

    const handleBooking = async () => {
        if (!session?.user?.id || !selectedSlot || !date) return
        setBookingLoading(true)

        try {
            const offset = date.getTimezoneOffset()
            const localDate = new Date(date.getTime() - (offset * 60 * 1000))
            const localDateStr = localDate.toISOString().split("T")[0]

            await createBooking(session.user.id, salonId, serviceId, localDateStr, selectedSlot)
            // Redirect to customer dashboard on success
            router.push("/customer/dashboard")
        } catch (error) {
            console.error("Booking error:", error)
            alert("Failed to confirm booking. The slot might have been taken.")
        } finally {
            setBookingLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <Card className="rounded-xl shadow-lg border-neutral-100">
                <CardHeader className="bg-neutral-50/50 rounded-t-xl border-b pb-8">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Select an Appointment Time
                    </CardTitle>
                    <CardDescription className="text-lg">Pick a date and choose an available time slot.</CardDescription>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="flex flex-col items-center p-4 border rounded-xl bg-white shadow-sm">
                        <h3 className="font-semibold text-xl mb-4 text-neutral-800">1. Choose Date</h3>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow-sm"
                            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-semibold text-xl mb-4 text-neutral-800">2. Choose Time Slot</h3>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-r-transparent animate-spin mb-4"></div>
                                    <p className="text-neutral-500 font-medium">Loading available slots...</p>
                                </div>
                            </div>
                        ) : slots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {slots.map((slot) => (
                                    <Button
                                        key={slot}
                                        variant={selectedSlot === slot ? "default" : "outline"}
                                        className={`transition-all ${selectedSlot === slot ? "bg-blue-600 shadow-md transform scale-105" : "hover:border-blue-300 hover:bg-blue-50"}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {slot}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                                <svg className="w-12 h-12 text-neutral-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-neutral-500 text-center font-medium">No available slots for this date.<br />Try selecting another day.</p>
                            </div>
                        )}

                        <div className="mt-auto pt-8">
                            <Button
                                size="lg"
                                className={`w-full text-lg shadow-md transition-all ${!selectedSlot || loading || bookingLoading ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transform hover:-translate-y-1'}`}
                                disabled={!selectedSlot || loading || bookingLoading}
                                onClick={handleBooking}
                            >
                                {bookingLoading ? "Confirming..." : "Confirm Booking"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
