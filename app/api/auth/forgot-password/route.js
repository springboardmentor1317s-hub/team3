import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function POST(request) {
    try {
        await connectDB();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ message: 'If user exists, reset link sent' });
        }

        // Generate specific reset token (short lived: 15 mins)
        // We include the user's current password hash in the secret to invalidate the token once password is changed
        // But since we can't easily access the password hash here without selecting it, we'll just stick to a standard exp time for now.
        // Ideally, we store "resetToken" in the DB. For simplicity without schema changes, we use a signed JWT.

        const resetToken = jwt.sign(
            { id: user._id, email: user.email, type: 'reset' },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink = `${NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        // MOCK EMAIL SENDING
        console.log('===========================================================');
        console.log('PASSWORD RESET REQUEST');
        console.log(`Email: ${email}`);
        console.log(`Link: ${resetLink}`);
        console.log('===========================================================');

        return NextResponse.json({ message: 'Reset link sent' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
