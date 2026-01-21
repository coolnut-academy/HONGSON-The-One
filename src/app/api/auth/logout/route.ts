import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout
 * Clears the admin session cookie
 */
export async function POST() {
    try {
        const cookieStore = await cookies();

        // Delete the admin session cookie by setting it to expire immediately
        cookieStore.set("admin_session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Expire immediately
            path: "/",
        });

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
