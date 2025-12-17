
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
    const { id } = await params;
    try {
        await connectDB();
        const { eventId } = await request.json();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.favorites.includes(eventId)) {
            user.favorites.push(eventId);
            await user.save();
        }

        return NextResponse.json({ message: "Favorite added", favorites: user.favorites });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await connectDB();
        const { eventId } = await request.json();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.favorites = user.favorites.filter(fav => fav.toString() !== eventId);
        await user.save();

        return NextResponse.json({ message: "Favorite removed", favorites: user.favorites });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
