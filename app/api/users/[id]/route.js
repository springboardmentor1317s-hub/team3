
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { fullName, college, password } = await request.json();

        const updateData = { fullName, college };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
