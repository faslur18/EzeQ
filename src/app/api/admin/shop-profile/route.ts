import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { eq } from "drizzle-orm"
import { authOptions } from "@/lib/auth"
import { db } from "@/db"
import { operatingHours, salons, services } from "@/db/schema"

type ServiceItem = {
    name: string
    duration: number
    price: number
}

type DaySchedule = {
    day: string
    enabled: boolean
    openTime: string
    closeTime: string
    breakStart: string
    breakEnd: string
}

const dayNameToIndex: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const user = session?.user as { id?: string; role?: string } | undefined

        if (!user?.id || user.role !== "SALON_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const salonName = body?.basicIdentity?.salonName?.trim()
        const fullAddress = body?.locationContact?.fullAddress?.trim()
        const daySchedules = (body?.operatingLogistics?.daySchedules || []) as DaySchedule[]
        const serviceMenu = (body?.serviceMenu || []) as ServiceItem[]

        if (!salonName || !fullAddress) {
            return NextResponse.json(
                { error: "Salon name and full address are required" },
                { status: 400 }
            )
        }

        const existingSalon = await db.select().from(salons).where(eq(salons.adminId, user.id))
        let salonId = existingSalon[0]?.id

        if (!salonId) {
            await db.insert(salons).values({
                adminId: user.id,
                name: salonName,
                address: fullAddress,
                rating: 0,
                isActive: true,
                status: "PENDING",
            })
            const newSalon = await db.select().from(salons).where(eq(salons.adminId, user.id))
            salonId = newSalon[0]?.id
        } else {
            await db
                .update(salons)
                .set({
                    name: salonName,
                    address: fullAddress,
                })
                .where(eq(salons.id, salonId))
        }

        if (!salonId) {
            return NextResponse.json({ error: "Failed to resolve salon profile" }, { status: 500 })
        }

        await db.delete(operatingHours).where(eq(operatingHours.salonId, salonId))
        const enabledHours = daySchedules
            .filter((d) => d.enabled && d.openTime && d.closeTime)
            .map((d) => ({
                salonId,
                dayOfWeek: dayNameToIndex[d.day],
                openTime: d.openTime,
                closeTime: d.closeTime,
            }))

        if (enabledHours.length > 0) {
            await db.insert(operatingHours).values(enabledHours)
        }

        await db.delete(services).where(eq(services.salonId, salonId))
        const validServices = serviceMenu
            .filter((s) => s.name?.trim() && Number(s.duration) > 0 && Number(s.price) >= 0)
            .map((s) => ({
                salonId,
                name: s.name.trim(),
                duration: Number(s.duration),
                price: Number(s.price),
            }))

        if (validServices.length > 0) {
            await db.insert(services).values(validServices)
        }

        return NextResponse.json({ message: "Shop details saved" }, { status: 200 })
    } catch (error) {
        console.error("shop-profile save error", error)
        return NextResponse.json({ error: "Failed to save shop details" }, { status: 500 })
    }
}
