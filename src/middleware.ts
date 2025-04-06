import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

function verifyToken(token: string): { isValid: boolean; payload: any } {
	try {
		// Use proper JWT verification with your secret
		const secret = process.env.TOKEN_SECRET || "";

		// This will throw an error if the token is invalid or expired
		const payload = jwt.verify(token, secret);

		return {
			isValid: true,
			payload: typeof payload === "object" ? payload : null,
		};
	} catch (error) {
		console.error("Token verification error:", error);
		return { isValid: false, payload: null };
	}
}

export async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Define public and protected paths
	const isPublicPath =
		path === "/login" ||
		path === "/signup" ||
		path === "/" ||
		path.startsWith("/doctors") ||
		path.startsWith("/services") ||
		path.startsWith("/blogs");

	const isProtectedPath =
		path.startsWith("/patient") ||
		path.startsWith("/doctor") ||
		path.startsWith("/admin") ||
		path === "/protected";

	const isLoginPage = path === "/login";
	const isSignupPage = path === "/signup";

	const token = req.cookies.get("token")?.value || "";

	// Check if token exists and is valid
	let isValidToken = false;
	let userRole = null;

	if (token) {
		const { isValid, payload } = verifyToken(token);
		isValidToken = isValid;
		userRole = payload?.role;
	}

	// Case 1: No token and trying to access protected route - redirect to login
	if (!token && isProtectedPath) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Case 2: Has valid token and trying to access login/signup - redirect to dashboard
	if (isValidToken && (isLoginPage || isSignupPage)) {
		return NextResponse.redirect(
			new URL(`/${userRole || "patient"}/dashboard`, req.url)
		);
	}

	// Case 3: Has invalid token and trying to access protected route - redirect to login
	if (!isValidToken && isProtectedPath) {
		const response = NextResponse.redirect(new URL("/login", req.url));
		// Clear cookies to ensure clean state
		response.cookies.delete("token");
		response.cookies.delete("refreshToken");
		return response;
	}

	// Default: allow the request to proceed
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/",
		"/login",
		"/signup",
		"/doctors/:path*",
		"/services/:path*",
		"/blogs/:path*",
		"/patient/:path*",
		"/doctor/:path*",
		"/admin/:path*",
		"/protected",
	],
};
