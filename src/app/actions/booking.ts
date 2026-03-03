"use server"

import { db } from "@/db"
import { salons, services, operatingHours, appointments } from "@/db/schema"
import { eq, and, gte, lte, ne, desc } from "drizzle-orm"
import { addMinutes, format, parse, isBefore, startOfDay, endOfDay } from "date-fns"

export async function getSalons() {
    return db.select()
        .from(salons)
        .where(
            and(
                eq(salons.status, "APPROVED"),
                eq(salons.isActive, true)
            )
        )
        .orderBy(desc(salons.rating))
}

export async function getSalonDetails(salonId: string) {
    const salonArr = await db.select().from(salons).where(eq(salons.id, salonId));
    if (salonArr.length === 0) return null;

    const salon = salonArr[0];

    const salonServices = await db.select().from(services).where(eq(services.salonId, salonId));
    const salonHours = await db.select().from(operatingHours).where(eq(operatingHours.salonId, salonId));

    return {
        ...salon,
        services: salonServices,
        operatingHours: salonHours
    };
}

export async function getAvailableTimeSlots(salonId: string, serviceId: string, dateStr: string) {
    const serviceArr = await db.select().from(services).where(eq(services.id, serviceId));
    if (serviceArr.length === 0) throw new Error("Service not found");
    const service = serviceArr[0];

    const selectedDate = new Date(dateStr)
    const dayOfWeek = selectedDate.getDay() // 0-6

    const hoursArr = await db.select().from(operatingHours)
        .where(
            and(
                eq(operatingHours.salonId, salonId),
                eq(operatingHours.dayOfWeek, dayOfWeek)
            )
        );

    // If no operating hours, salon is closed
    if (hoursArr.length === 0) return []
    const opsHours = hoursArr[0];

    const appts = await db.select({
        startTime: appointments.startTime,
        duration: services.duration
    }).from(appointments)
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(
            and(
                eq(appointments.salonId, salonId),
                gte(appointments.appointmentDate, format(startOfDay(selectedDate), "yyyy-MM-dd")),
                lte(appointments.appointmentDate, format(endOfDay(selectedDate), "yyyy-MM-dd")),
                ne(appointments.status, "CANCELLED")
            )
        )

    // Parse open and close times
    const openTime = parse(opsHours.openTime, "HH:mm", selectedDate)
    const closeTime = parse(opsHours.closeTime, "HH:mm", selectedDate)

    const slots: string[] = []
    let currentTime = openTime

    const now = new Date()

    // Generate slots
    while (isBefore(addMinutes(currentTime, service.duration), closeTime) || currentTime.getTime() === closeTime.getTime() - service.duration * 60000) {
        // If date is today, skip past times
        if (isBefore(currentTime, now) && format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")) {
            currentTime = addMinutes(currentTime, 30) // step every 30 mins
            continue
        }

        const slotStartStr = format(currentTime, "HH:mm")
        const slotEnd = addMinutes(currentTime, service.duration)

        // Check overlaps
        const isOverlapping = appts.some((appt) => {
            const apptStart = parse(appt.startTime, "HH:mm", selectedDate)
            const apptEnd = addMinutes(apptStart, appt.duration)

            return (
                (isBefore(currentTime, apptEnd) && isBefore(apptStart, slotEnd)) ||
                currentTime.getTime() === apptStart.getTime()
            )
        })

        if (!isOverlapping) {
            slots.push(slotStartStr)
        }

        // Step every 30 minutes (could be parameterized)
        currentTime = addMinutes(currentTime, 30)
    }

    return slots
}

export async function createBooking(customerId: string, salonId: string, serviceId: string, dateStr: string, startTime: string) {
    // Simple validation check
    const slots = await getAvailableTimeSlots(salonId, serviceId, dateStr)
    if (!slots.includes(startTime)) {
        throw new Error("Selected time slot is no longer available.")
    }

    await db.insert(appointments).values({
        customerId,
        salonId,
        serviceId,
        appointmentDate: dateStr,
        startTime,
        status: "CONFIRMED" // MVP assumes auto confirm
    });

    return true;
}
