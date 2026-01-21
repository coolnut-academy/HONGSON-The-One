import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/auth/check
 * Checks if the user has a valid admin session cookie
 */
export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("admin_session");

        if (!sessionCookie || !sessionCookie.value) {
            return NextResponse.json(
                { authenticated: false },
                { status: 200 }
            );
        }

        // Validate the session token format
        // In production, you would verify this against a database or JWT verification
        const sessionValue = sessionCookie.value;

        // Basic validation: check if the session token is not empty and is valid base64
        try {
            const decoded = Buffer.from(sessionValue, "base64").toString("utf-8");
            // Session token format: timestamp-secretkey
            const parts = decoded.split("-");

            if (parts.length < 2) {
                return NextResponse.json(
                    { authenticated: false },
                    { status: 200 }
                );
            }

            const timestamp = parseInt(parts[0], 10);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            // Check if the session has expired
            if (Date.now() - timestamp > maxAge) {
                // Session expired, clear the cookie
                cookieStore.set("admin_session", "", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 0,
                    path: "/",
                });

                return NextResponse.json(
                    { authenticated: false },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { authenticated: true },
                { status: 200 }
            );
        } catch {
            // Invalid session format
            return NextResponse.json(
                { authenticated: false },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { authenticated: false, error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
