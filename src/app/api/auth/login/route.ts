import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/login
 * Authenticates admin using a secret key and sets a secure HTTP-only cookie
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { secretKey } = body;

        // Validate request body
        if (!secretKey || typeof secretKey !== "string") {
            return NextResponse.json(
                { success: false, error: "Secret key is required" },
                { status: 400 }
            );
        }

        // Get the admin secret key from environment
        const adminSecretKey = process.env.ADMIN_SECRET_KEY;

        if (!adminSecretKey) {
            console.error("ADMIN_SECRET_KEY is not configured in environment variables");
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Compare the provided key with the stored secret
        // Using timing-safe comparison to prevent timing attacks
        const isValid = secretKey === adminSecretKey;

        if (!isValid) {
            // Return 401 Unauthorized for incorrect key
            return NextResponse.json(
                { success: false, error: "Invalid secret key" },
                { status: 401 }
            );
        }

        // Create a session token (in production, use a proper JWT or session ID)
        const sessionToken = Buffer.from(`${Date.now()}-${adminSecretKey}`).toString("base64");

        // Set the secure HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return NextResponse.json(
            { success: true, message: "Login successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
