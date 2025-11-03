import { NextRequest, NextResponse } from "next/server";

/**
 * Diagnostic endpoint to check if NextAuth is configured correctly
 */
export async function GET(req: NextRequest) {
  const diagnostics = {
    googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
    nextAuthSecretSet: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",
    mongodbUriSet: !!process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
  };

  console.log("🔍 NextAuth Configuration Check:");
  console.log(JSON.stringify(diagnostics, null, 2));

  return NextResponse.json({
    success: true,
    message: "NextAuth configuration check",
    config: diagnostics,
    warnings: [
      !diagnostics.googleClientIdSet && "GOOGLE_CLIENT_ID not set",
      !diagnostics.googleSecretSet && "GOOGLE_CLIENT_SECRET not set",
      !diagnostics.nextAuthSecretSet && "NEXTAUTH_SECRET not set",
      !diagnostics.mongodbUriSet && "MONGODB_URI not set",
    ].filter(Boolean),
  });
}

