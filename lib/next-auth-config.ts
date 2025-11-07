import { NextAuthOptions } from "next-auth";
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
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 Sign in attempt started...");
      console.log("User email:", user.email);
      console.log("Provider:", account?.provider);
      
      try {
        console.log("📡 Connecting to database...");
        await connectDB();
        console.log("✅ Database connected");

        if (!user.email) {
          console.error("❌ No email provided");
          return false;
        }

        console.log("🔍 Looking for existing user...");
        let dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          console.log("✅ User found:", dbUser.name);
          
          if (!dbUser.image && user.image) {
            dbUser.image = user.image;
            await dbUser.save();
            console.log("📸 Updated user image");
          }
        } else {
          console.log("➕ Creating new user...");
          dbUser = await User.create({
            email: user.email,
            name: user.name || "User",
            image: user.image || null,
            role: "user",
            isActive: true,
          });
          console.log("✅ New user created:", dbUser.name);
        }

        return true;
      } catch (error) {
        console.error("❌ Sign in error:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          
          if (dbUser) {
            (session.user as any).role = dbUser.role;
            (session.user as any).id = dbUser._id.toString();
            (session.user as any).timezone = dbUser.timezone;
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
