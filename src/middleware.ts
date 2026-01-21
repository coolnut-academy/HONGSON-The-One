import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to protect admin routes
 * Runs on every request matching the configured paths
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request is for an admin page (not API routes)
    if (pathname.startsWith("/admin")) {
        // Get the admin session cookie
        const sessionCookie = request.cookies.get("admin_session");

        // If no session cookie, redirect to home page
        if (!sessionCookie || !sessionCookie.value) {
            // Create URL for redirect with a query param to trigger login modal
            const url = request.nextUrl.clone();
            url.pathname = "/";
            url.searchParams.set("showLogin", "true");

            return NextResponse.redirect(url);
        }

        // Validate the session token
        try {
            const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
            const parts = decoded.split("-");

            if (parts.length < 2) {
                // Invalid token format
                const url = request.nextUrl.clone();
                url.pathname = "/";
                url.searchParams.set("showLogin", "true");

                return NextResponse.redirect(url);
            }

            const timestamp = parseInt(parts[0], 10);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            // Check if the session has expired
            if (Date.now() - timestamp > maxAge) {
                // Session expired
                const url = request.nextUrl.clone();
                url.pathname = "/";
                url.searchParams.set("showLogin", "true");
                url.searchParams.set("expired", "true");

                const response = NextResponse.redirect(url);

                // Clear the expired cookie
                response.cookies.set("admin_session", "", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 0,
                    path: "/",
                });

                return response;
            }

            // Valid session, allow access
            return NextResponse.next();
        } catch {
            // Invalid session, redirect to home
            const url = request.nextUrl.clone();
            url.pathname = "/";
            url.searchParams.set("showLogin", "true");

            return NextResponse.redirect(url);
        }
    }

    // For all other routes, continue normally
    return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 * This protects all /admin/* routes
 */
export const config = {
    matcher: [
        "/admin/:path*",
    ],
};
