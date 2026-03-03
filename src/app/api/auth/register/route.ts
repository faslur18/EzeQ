import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        // 1. Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Check if user already exists
        const existingArr = await db.select().from(users).where(eq(users.email, email));
        if (existingArr.length > 0) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
        }

        // 3. Create user
        // Note: Passwords should always be hashed. This is plain-text for MVP simplicity only!
        await db.insert(users).values({
            name,
            email,
            password,
            role: role || 'CUSTOMER'
        });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
