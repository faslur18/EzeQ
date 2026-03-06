import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Enums ───────────────────────────────────────────────────────────────
export const roleEnum = ['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'] as const;
export const salonStatusEnum = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export const appointmentStatusEnum = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const;

// ─── Users ───────────────────────────────────────────────────────────────
export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: text('role').notNull().default('CUSTOMER'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

// ─── Salons ──────────────────────────────────────────────────────────────
export const salons = sqliteTable('salons', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    adminId: text('admin_id').notNull().references(() => users.id),
    name: text('name').notNull(),
    address: text('address').notNull(),
    description: text('description'),
    contactPhone: text('contact_phone'),
    contactEmail: text('contact_email'),
    profileImage: text('profile_image'),
    coverImage: text('cover_image'),
    rating: real('rating').default(0),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    status: text('status').notNull().default('PENDING'),
});

// ─── Services ────────────────────────────────────────────────────────────
export const services = sqliteTable('services', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    salonId: text('salon_id').notNull().references(() => salons.id),
    name: text('name').notNull(),
    duration: integer('duration').notNull(),
    price: real('price').notNull(),
});

// ─── Operating Hours ─────────────────────────────────────────────────────
export const operatingHours = sqliteTable('operating_hours', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    salonId: text('salon_id').notNull().references(() => salons.id),
    dayOfWeek: integer('day_of_week').notNull(),
    openTime: text('open_time').notNull(),
    closeTime: text('close_time').notNull(),
});

// ─── Appointments ────────────────────────────────────────────────────────
export const appointments = sqliteTable('appointments', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    customerId: text('customer_id').notNull().references(() => users.id),
    salonId: text('salon_id').notNull().references(() => salons.id),
    serviceId: text('service_id').notNull().references(() => services.id),
    appointmentDate: text('appointment_date').notNull(),
    startTime: text('start_time').notNull(),
    status: text('status').notNull().default('PENDING'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});
