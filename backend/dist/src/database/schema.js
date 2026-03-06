"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointments = exports.operatingHours = exports.services = exports.salons = exports.users = exports.appointmentStatusEnum = exports.salonStatusEnum = exports.roleEnum = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.roleEnum = ['CUSTOMER', 'SALON_ADMIN', 'SUPER_ADMIN'];
exports.salonStatusEnum = ['PENDING', 'APPROVED', 'REJECTED'];
exports.appointmentStatusEnum = ['PENDING', 'CONFIRMED', 'CANCELLED'];
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: (0, sqlite_core_1.text)('name'),
    email: (0, sqlite_core_1.text)('email').notNull().unique(),
    password: (0, sqlite_core_1.text)('password').notNull(),
    role: (0, sqlite_core_1.text)('role').notNull().default('CUSTOMER'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(strftime('%s', 'now'))`),
});
exports.salons = (0, sqlite_core_1.sqliteTable)('salons', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    adminId: (0, sqlite_core_1.text)('admin_id').notNull().references(() => exports.users.id),
    name: (0, sqlite_core_1.text)('name').notNull(),
    address: (0, sqlite_core_1.text)('address').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    contactPhone: (0, sqlite_core_1.text)('contact_phone'),
    contactEmail: (0, sqlite_core_1.text)('contact_email'),
    profileImage: (0, sqlite_core_1.text)('profile_image'),
    coverImage: (0, sqlite_core_1.text)('cover_image'),
    rating: (0, sqlite_core_1.real)('rating').default(0),
    isActive: (0, sqlite_core_1.integer)('is_active', { mode: 'boolean' }).default(true),
    status: (0, sqlite_core_1.text)('status').notNull().default('PENDING'),
});
exports.services = (0, sqlite_core_1.sqliteTable)('services', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    salonId: (0, sqlite_core_1.text)('salon_id').notNull().references(() => exports.salons.id),
    name: (0, sqlite_core_1.text)('name').notNull(),
    duration: (0, sqlite_core_1.integer)('duration').notNull(),
    price: (0, sqlite_core_1.real)('price').notNull(),
});
exports.operatingHours = (0, sqlite_core_1.sqliteTable)('operating_hours', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    salonId: (0, sqlite_core_1.text)('salon_id').notNull().references(() => exports.salons.id),
    dayOfWeek: (0, sqlite_core_1.integer)('day_of_week').notNull(),
    openTime: (0, sqlite_core_1.text)('open_time').notNull(),
    closeTime: (0, sqlite_core_1.text)('close_time').notNull(),
});
exports.appointments = (0, sqlite_core_1.sqliteTable)('appointments', {
    id: (0, sqlite_core_1.text)('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    customerId: (0, sqlite_core_1.text)('customer_id').notNull().references(() => exports.users.id),
    salonId: (0, sqlite_core_1.text)('salon_id').notNull().references(() => exports.salons.id),
    serviceId: (0, sqlite_core_1.text)('service_id').notNull().references(() => exports.services.id),
    appointmentDate: (0, sqlite_core_1.text)('appointment_date').notNull(),
    startTime: (0, sqlite_core_1.text)('start_time').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull().default('PENDING'),
    createdAt: (0, sqlite_core_1.integer)('created_at', { mode: 'timestamp' }).notNull().default((0, drizzle_orm_1.sql) `(strftime('%s', 'now'))`),
});
//# sourceMappingURL=schema.js.map