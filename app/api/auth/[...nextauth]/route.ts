import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  debug: true, // Enable debug mode to see detailed logs
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 Sign in attempt started...");
      console.log("User email:", user.email);
      console.log("Provider:", account?.provider);
      
      try {
        console.log("📡 Connecting to database...");
        await connectDB();
        console.log("✅ Database connected");

        // Check if user exists
        console.log("🔍 Checking if user exists:", user.email);
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          console.log("👤 User not found, creating new user...");
          // Create new user as regular customer (not admin)
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            password: "", // Google auth doesn't need password
            role: "user", // Regular customer role
          });
          console.log("✅ New user created successfully!");
          console.log("User ID:", existingUser._id);
          console.log("User role:", existingUser.role);
        } else {
          console.log("✅ Existing user found");
          console.log("User ID:", existingUser._id);
          console.log("User role:", existingUser.role);
        }

        // Allow all users to sign in (both user and admin)
        console.log("✅ Sign in successful for:", user.email);
        return true;
      } catch (error) {
        console.error("❌ Sign in error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return false;
      }
    },
    async session({ session, token }) {
      console.log("🔄 Session callback started");
      console.log("Session user:", session.user?.email);
      
      if (session.user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          
          if (dbUser) {
            (session.user as any).id = dbUser._id.toString();
            (session.user as any).role = dbUser.role;
            console.log("✅ Session enriched with user data");
            console.log("User ID:", (session.user as any).id);
            console.log("User role:", (session.user as any).role);
          } else {
            console.log("⚠️ User not found in database during session");
          }
        } catch (error) {
          console.error("❌ Session error:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/api/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

