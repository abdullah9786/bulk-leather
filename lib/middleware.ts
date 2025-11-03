import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "./auth";

export function withAuth(
  handler: (req: NextRequest, userId: string, userRole: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const token = extractTokenFromHeader(req.headers.get("authorization") || "");
      
      if (!token) {
        return NextResponse.json(
          { error: "No authorization token provided" },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }

      return handler(req, payload.userId, payload.role);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

export function withAdminAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return withAuth(async (req, userId, userRole) => {
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    return handler(req, userId);
  });
}

