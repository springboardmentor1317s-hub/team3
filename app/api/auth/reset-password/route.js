import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
    try {
        await connectDB();
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        if (decoded.type !== 'reset') {
            return NextResponse.json({ error: 'Invalid token type' }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update password
        // Ensure you use the same hashing logic (or lack thereof if currently plain text) as your Login.
        // Based on previous login route analysis, it seemed to be plain text comparison: `if (user.password !== password)`.
        // So we will just save it directly. 
        // IMPORTANT: If you switch to bcrypt later, you must update this too.
        user.password = password;
        await user.save();

        return NextResponse.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
