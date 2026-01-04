import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const eventSchema = new mongoose.Schema({
    title: String,
    createdBy: { type: mongoose.Schema.Types.Mixed },
}, { strict: false });

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
}, { strict: false });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkOwnership() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const eventName = "Hackverse";
        // Using regex for flexible matching
        const events = await Event.find({ title: { $regex: eventName, $options: 'i' } });

        if (events.length === 0) {
            console.log(`Event "${eventName}" not found.`);
            return;
        }

        console.log(`Found ${events.length} event(s) matching "${eventName}":`);

        for (const event of events) {
            console.log(`\n------------------------------------------------`);
            console.log(`Event Title: ${event.title}`);
            console.log(`Event ID: ${event._id}`);

            let creatorId = event.createdBy;
            if (typeof creatorId === 'object' && creatorId?._id) {
                creatorId = creatorId._id.toString();
            } else if (creatorId) {
                creatorId = creatorId.toString();
            }

            console.log(`CreatedBy Field Raw:`, event.createdBy);
            console.log(`Resolved Creator ID: ${creatorId}`);

            if (!creatorId) {
                console.log("Stats: Has NO creator ID.");
                continue;
            }

            const user = await User.findById(creatorId);
            if (user) {
                console.log(`Creator Found: ${user.fullName} (${user.email})`);
            } else {
                console.log(`Creator NOT found in user database (User might have been deleted).`);
            }
        }
        console.log(`\n------------------------------------------------`);

        // List 'Srushti' users to compare
        const currentUsers = await User.find({ fullName: { $regex: 'Srushti', $options: 'i' } });
        console.log(`\nCurrent 'Srushti' Users in DB:`);
        currentUsers.forEach(u => {
            console.log(`- ${u.fullName} (${u.email}) ID: ${u._id}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkOwnership();
