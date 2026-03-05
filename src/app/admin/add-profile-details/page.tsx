"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/ui/image-upload"
import AuthGuard from "@/components/auth/AuthGuard"
import { useCreateSalonMutation } from "@/store/services/salonsApi"
import { useCreateServiceMutation } from "@/store/services/servicesApi"
import { useSetHoursMutation } from "@/store/services/hoursApi"

type WizardStep = 1 | 2 | 3

type DaySchedule = {
    day: string
    enabled: boolean
    openTime: string
    closeTime: string
    breakStart: string
    breakEnd: string
}

type ServiceItem = {
    id: string
    name: string
    duration: number
    price: number
}

const DAYS: DaySchedule[] = [
    { day: "Monday", enabled: true, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
    { day: "Tuesday", enabled: true, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
    { day: "Wednesday", enabled: true, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
    { day: "Thursday", enabled: true, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
    { day: "Friday", enabled: true, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
    { day: "Saturday", enabled: true, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
    { day: "Sunday", enabled: false, openTime: "09:00", closeTime: "18:00", breakStart: "", breakEnd: "" },
]

function AdminAddProfileDetailsContent() {
    const user = useSelector((state: RootState) => state.auth.user)
    const router = useRouter()

    const [createSalon] = useCreateSalonMutation()
    const [createService] = useCreateServiceMutation()
    const [setHours] = useSetHoursMutation()

    const [step, setStep] = useState<WizardStep>(1)
    const [loading, setLoading] = useState(false)

    const [salonName, setSalonName] = useState("")
    const [salonCategory, setSalonCategory] = useState("UNISEX")
    const [shortDescription, setShortDescription] = useState("")
    const [logoImageUrl, setLogoImageUrl] = useState("")
    const [coverImageUrls, setCoverImageUrls] = useState(["", "", "", ""])

    const [fullAddress, setFullAddress] = useState("")
    const [landmark, setLandmark] = useState("")
    const [pincode, setPincode] = useState("")
    const [googleMapsLink, setGoogleMapsLink] = useState("")
    const [publicContactNumber, setPublicContactNumber] = useState("")

    const [bufferMinutes, setBufferMinutes] = useState(10)
    const [daySchedules, setDaySchedules] = useState<DaySchedule[]>(DAYS)

    const [services, setServices] = useState<ServiceItem[]>([
        { id: crypto.randomUUID(), name: "", duration: 30, price: 0 },
    ])
    const [paymentMethods, setPaymentMethods] = useState<string[]>(["CASH"])
    const [cancellationPolicy, setCancellationPolicy] = useState("FREE_2_HOURS")

    const canMoveFromStep1 = useMemo(() => {
        return Boolean(salonName && shortDescription && fullAddress && pincode && publicContactNumber)
    }, [salonName, shortDescription, fullAddress, pincode, publicContactNumber])

    const canMoveFromStep2 = useMemo(() => {
        const enabledDays = daySchedules.filter((d) => d.enabled)
        return enabledDays.length > 0 && enabledDays.every((d) => d.openTime && d.closeTime)
    }, [daySchedules])

    const canSubmit = useMemo(() => {
        return services.length > 0 && services.every((s) => s.name && s.duration > 0 && s.price >= 0)
    }, [services])

    const togglePaymentMethod = (method: string) => {
        setPaymentMethods((prev) =>
            prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
        )
    }

    const updateDay = (index: number, patch: Partial<DaySchedule>) => {
        setDaySchedules((prev) => prev.map((day, i) => (i === index ? { ...day, ...patch } : day)))
    }

    const updateService = (id: string, patch: Partial<ServiceItem>) => {
        setServices((prev) => prev.map((service) => (service.id === id ? { ...service, ...patch } : service)))
    }

    const addService = () => {
        setServices((prev) => [...prev, { id: crypto.randomUUID(), name: "", duration: 30, price: 0 }])
    }

    const removeService = (id: string) => {
        setServices((prev) => prev.filter((service) => service.id !== id))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            // 1. Create the salon
            const salon = await createSalon({
                name: salonName,
                address: fullAddress,
            }).unwrap()

            // 2. Create services
            for (const service of services) {
                if (service.name) {
                    await createService({
                        salonId: salon.id,
                        body: {
                            name: service.name,
                            duration: service.duration,
                            price: service.price,
                        },
                    }).unwrap()
                }
            }

            // 3. Set operating hours
            const enabledDays = daySchedules
                .filter((d) => d.enabled)
                .map((d, _i) => ({
                    dayOfWeek: DAYS.findIndex((day) => day.day === d.day),
                    openTime: d.openTime,
                    closeTime: d.closeTime,
                }))

            if (enabledDays.length > 0) {
                await setHours({
                    salonId: salon.id,
                    body: { hours: enabledDays },
                }).unwrap()
            }

            router.push("/admin/dashboard")
        } catch (error) {
            console.error(error)
            alert("Could not save shop details. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Complete Shop Details</h1>
                    <p className="text-sm text-muted-foreground">
                        Fill your profile in 3 short steps. You can update this later anytime.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Step {step} of 3</CardTitle>
                        <CardDescription>
                            {step === 1 && "Basic Info and Location"}
                            {step === 2 && "Operating Hours"}
                            {step === 3 && "Services, Payments and Policies"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {step === 1 && (
                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold">Basic Identity</h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="salonName">Salon Name</Label>
                                            <Input id="salonName" value={salonName} onChange={(e) => setSalonName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="salonCategory">Salon Category</Label>
                                            <select
                                                id="salonCategory"
                                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                                                value={salonCategory}
                                                onChange={(e) => setSalonCategory(e.target.value)}
                                            >
                                                <option value="UNISEX">Unisex</option>
                                                <option value="MENS_GROOMING">Men&apos;s Grooming</option>
                                                <option value="WOMENS_PARLOUR">Women&apos;s Parlour</option>
                                                <option value="SPA">Spa</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shortDescription">Short Description</Label>
                                        <textarea
                                            id="shortDescription"
                                            value={shortDescription}
                                            onChange={(e) => setShortDescription(e.target.value)}
                                            rows={3}
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            placeholder="Tell customers about your salon specialty and experience."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <ImageUpload
                                            label="Logo / Profile Image"
                                            value={logoImageUrl}
                                            onChange={setLogoImageUrl}
                                            aspectRatio="square"
                                            className="max-w-[200px]"
                                        />

                                        <div className="space-y-2">
                                            <Label>Cover / Interior Photos (up to 4)</Label>
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                {coverImageUrls.map((url, idx) => (
                                                    <ImageUpload
                                                        key={idx}
                                                        value={url}
                                                        onChange={(newUrl) =>
                                                            setCoverImageUrls((prev) => prev.map((item, i) => (i === idx ? newUrl : item)))
                                                        }
                                                        aspectRatio="landscape"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold">Location and Contact</h2>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullAddress">Full Address</Label>
                                        <Input id="fullAddress" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="landmark">Landmark</Label>
                                            <Input id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Pincode</Label>
                                            <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="mapsLink">Google Maps Link / Coordinates</Label>
                                            <Input id="mapsLink" value={googleMapsLink} onChange={(e) => setGoogleMapsLink(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="publicContact">Public Contact Number</Label>
                                            <Input
                                                id="publicContact"
                                                value={publicContactNumber}
                                                onChange={(e) => setPublicContactNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold">Operating Logistics</h2>
                                    <div className="max-w-xs space-y-2">
                                        <Label htmlFor="bufferMinutes">Standard Buffer Time (minutes)</Label>
                                        <Input
                                            id="bufferMinutes"
                                            type="number"
                                            min={0}
                                            value={bufferMinutes}
                                            onChange={(e) => setBufferMinutes(Number(e.target.value || 0))}
                                        />
                                    </div>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="font-medium">Working Days and Timings</h3>
                                    <div className="space-y-3">
                                        {daySchedules.map((day, index) => (
                                            <div key={day.day} className="rounded-md border bg-white p-4">
                                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                                    <label className="inline-flex items-center gap-2 text-sm font-medium">
                                                        <input
                                                            type="checkbox"
                                                            checked={day.enabled}
                                                            onChange={(e) => updateDay(index, { enabled: e.target.checked })}
                                                        />
                                                        {day.day}
                                                    </label>
                                                </div>
                                                {day.enabled && (
                                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                                                        <div className="space-y-1">
                                                            <Label>Open</Label>
                                                            <Input
                                                                type="time"
                                                                value={day.openTime}
                                                                onChange={(e) => updateDay(index, { openTime: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label>Close</Label>
                                                            <Input
                                                                type="time"
                                                                value={day.closeTime}
                                                                onChange={(e) => updateDay(index, { closeTime: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label>Break Start</Label>
                                                            <Input
                                                                type="time"
                                                                value={day.breakStart}
                                                                onChange={(e) => updateDay(index, { breakStart: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label>Break End</Label>
                                                            <Input
                                                                type="time"
                                                                value={day.breakEnd}
                                                                onChange={(e) => updateDay(index, { breakEnd: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">Service Menu</h2>
                                        <Button type="button" variant="outline" onClick={addService}>
                                            Add Service
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {services.map((service, idx) => (
                                            <div key={service.id} className="rounded-md border bg-white p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <h3 className="font-medium">Service {idx + 1}</h3>
                                                    {services.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="h-8 px-3 text-xs"
                                                            onClick={() => removeService(service.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                    <div className="space-y-1">
                                                        <Label>Service Name</Label>
                                                        <Input
                                                            value={service.name}
                                                            onChange={(e) => updateService(service.id, { name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Duration (minutes)</Label>
                                                        <Input
                                                            type="number"
                                                            min={5}
                                                            step={5}
                                                            value={service.duration}
                                                            onChange={(e) => updateService(service.id, { duration: Number(e.target.value || 0) })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Price</Label>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step={0.01}
                                                            value={service.price}
                                                            onChange={(e) => updateService(service.id, { price: Number(e.target.value || 0) })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold">Policies and Payments</h2>

                                    <div className="space-y-2">
                                        <Label>Accepted Payment Methods</Label>
                                        <div className="flex flex-wrap gap-3">
                                            {["CASH", "UPI", "CARD"].map((method) => (
                                                <label key={method} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={paymentMethods.includes(method)}
                                                        onChange={() => togglePaymentMethod(method)}
                                                    />
                                                    {method === "CARD" ? "Credit / Debit Cards" : method}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="max-w-sm space-y-2">
                                        <Label htmlFor="cancelPolicy">Cancellation Policy</Label>
                                        <select
                                            id="cancelPolicy"
                                            value={cancellationPolicy}
                                            onChange={(e) => setCancellationPolicy(e.target.value)}
                                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                                        >
                                            <option value="FREE_2_HOURS">Free cancellation up to 2 hours before</option>
                                            <option value="FREE_24_HOURS">Free cancellation up to 24 hours before</option>
                                            <option value="NO_CANCELLATIONS">No cancellations</option>
                                        </select>
                                    </div>
                                </section>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={step === 1}
                                onClick={() => setStep((prev) => (Math.max(1, prev - 1) as WizardStep))}
                            >
                                Back
                            </Button>

                            <div className="flex gap-2">
                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        disabled={(step === 1 && !canMoveFromStep1) || (step === 2 && !canMoveFromStep2)}
                                        onClick={() => setStep((prev) => (Math.min(3, prev + 1) as WizardStep))}
                                    >
                                        Continue
                                    </Button>
                                ) : (
                                    <Button type="button" disabled={!canSubmit || loading} onClick={handleSubmit}>
                                        {loading ? "Saving..." : "Save Shop Details"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function AdminAddProfileDetailsPage() {
    return (
        <AuthGuard allowedRoles={["SALON_ADMIN"]}>
            <AdminAddProfileDetailsContent />
        </AuthGuard>
    )
}
