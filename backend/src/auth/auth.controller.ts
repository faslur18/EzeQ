import { Response } from 'express';
import { db } from '../database/db';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthController {
    static async register(req: any, res: Response) {
        const { name, email, password, role } = req.body;
        try {
            const existing = await db.select().from(users).where(eq(users.email, email));
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Email is already registered' });
            }

            await db.insert(users).values({
                name: name || '',
                email,
                password,
                role: role || 'CUSTOMER',
            });

            return res.status(201).json({ message: 'User created successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: any, res: Response) {
        const { email, password } = req.body;
        try {
            const result = await db.select().from(users).where(eq(users.email, email));
            const user = result[0];

            if (!user || user.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = { sub: user.id, role: user.role, email: user.email, name: user.name };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

            return res.json({
                access_token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getProfile(req: AuthRequest, res: Response) {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        try {
            const result = await db.select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            }).from(users).where(eq(users.id, req.user!.sub));

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.json(result[0]);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
