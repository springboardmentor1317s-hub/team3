import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === 'google' || account.provider === 'azure-ad') {
                const { name, email } = user;
                try {
                    await connectDB();
                    const userExists = await User.findOne({ email });
                    if (!userExists) {
                        // Create user directly in DB
                        await User.create({
                            fullName: name,
                            email,
                            password: Math.random().toString(36).slice(-8), // Dummy password
                            role: 'student',
                            college: 'External',
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Social login error:", error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            // Add MongoDB user id to session
            await connectDB();
            const user = await User.findOne({ email: session.user.email });
            if (user) {
                session.user.id = user._id.toString();
                session.user.role = user.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt'
    }
});

export { handler as GET, handler as POST };
