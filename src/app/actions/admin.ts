"use server"

import { db } from "@/db"
import { users, salons, appointments, services, operatingHours } from "@/db/schema"
import { eq, and, asc } from "drizzle-orm"

// Super Admin actions
export async function getDashboardAnalytics() {
    const [usersArr, salonsArr, apptsArr] = await Promise.all([
        db.select().from(users),
        db.select().from(salons),
        db.select().from(appointments)
    ])
    return {
        totalUsers: usersArr.length,
        totalSalons: salonsArr.length,
        totalAppointments: apptsArr.length
    }
}

export async function getAllSalonsForAdmin() {
    return db.select()
        .from(salons)
        .leftJoin(users, eq(salons.adminId, users.id))
        .orderBy(asc(salons.status))
}

export async function updateSalonStatus(salonId: string, status: "APPROVED" | "REJECTED" | "PENDING") {
    return db.update(salons)
        .set({ status, isActive: status === "APPROVED" })
        .where(eq(salons.id, salonId))
}

// Salon Admin actions (for specific salon)
export async function getSalonAdminDashboard(adminId: string) {
    const salonArr = await db.select().from(salons).where(eq(salons.adminId, adminId))
    if (salonArr.length === 0) return null
    const salon = salonArr[0]

    const todayStr = new Date().toISOString().split("T")[0]

    // Manual join for dashboard appointments
    const appts = await db.select()
        .from(appointments)
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .leftJoin(users, eq(appointments.customerId, users.id))
        .where(
            and(
                eq(appointments.salonId, salon.id),
                eq(appointments.appointmentDate, todayStr)
            )
        )
        .orderBy(asc(appointments.startTime))

    return { salon, appointments: appts }
}

export async function createService(salonId: string, name: string, duration: number, price: number) {
    return db.insert(services).values({
        salonId,
        name,
        duration,
        price
    })
}

export async function updateOperatingHours(salonId: string, dayOfWeek: number, openTime: string, closeTime: string) {
    const existingArr = await db.select().from(operatingHours)
        .where(
            and(
                eq(operatingHours.salonId, salonId),
                eq(operatingHours.dayOfWeek, dayOfWeek)
            )
        )

    if (existingArr.length > 0) {
        return db.update(operatingHours)
            .set({ openTime, closeTime })
            .where(eq(operatingHours.id, existingArr[0].id))
    } else {
        return db.insert(operatingHours).values({
            salonId,
            dayOfWeek,
            openTime,
            closeTime
        })
    }
}
