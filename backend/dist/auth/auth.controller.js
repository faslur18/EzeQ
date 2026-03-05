"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../database/db");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const SALT_ROUNDS = 10;
class AuthController {
    static async register(req, res) {
        const { name, email, password, role } = req.body ?? {};
        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const existing = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Email is already registered' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
            await db_1.db.insert(schema_1.users).values({
                name: name || '',
                email,
                password: hashedPassword,
                role: role || 'CUSTOMER',
            });
            return res.status(201).json({ message: 'User created successfully' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body ?? {};
        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const result = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
            const user = result[0];
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const storedPassword = user.password;
            const isBcryptHash = storedPassword.startsWith('$2');
            const isValidPassword = isBcryptHash
                ? await bcryptjs_1.default.compare(password, storedPassword)
                : storedPassword === password;
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            if (!isBcryptHash) {
                const migratedHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
                await db_1.db.update(schema_1.users).set({ password: migratedHash }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
            }
            const payload = { sub: user.id, role: user.role, email: user.email, name: user.name };
            const token = jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, { expiresIn: '1d' });
            return res.json({
                access_token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async getProfile(req, res) {
        if (!req.user)
            return res.status(401).json({ message: 'Unauthorized' });
        try {
            const result = await db_1.db.select({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                role: schema_1.users.role,
                createdAt: schema_1.users.createdAt,
            }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, req.user.sub));
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(result[0]);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map