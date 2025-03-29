import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function verifyToken(token: string): { isValid: boolean; payload: any } {
	try {
		const [headerB64, payloadB64] = token.split(".");
		const payload = JSON.parse(atob(payloadB64));
		const now = Math.floor(Date.now() / 1000);

		return {
			isValid: !(payload.exp && payload.exp < now),
			payload,
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

	const token = req.cookies.get("token")?.value || "";
	const refreshToken = req.cookies.get("refreshToken")?.value || "";

	// No token and trying to access protected route - redirect to login
	if (!token && isProtectedPath) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	// Has token
	if (token) {
		const { isValid, payload } = verifyToken(token);

		// If token is valid and user is on public path, redirect to appropriate dashboard
		if (isValid && isPublicPath) {
			const role = payload?.role || "patient";
			return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
		}

		// If token is invalid and on protected path, try refresh or redirect to login
		if (!isValid && isProtectedPath) {
			if (refreshToken) {
				try {
					const response = await fetch(
						new URL("/api/auth/refresh", req.url).toString(),
						{
							method: "POST",
							headers: {
								Cookie: `refreshToken=${refreshToken}`,
							},
						}
					);

					if (response.ok) {
						const data = await response.json();
						const newToken = data.token;

						if (newToken) {
							const res = NextResponse.next();
							res.cookies.set("token", newToken, {
								httpOnly: true,
								secure: process.env.NODE_ENV === "production",
								sameSite: "strict",
								maxAge: 60 * 60,
							});
							return res;
						}
					}
				} catch (refreshError) {
					console.error("Error refreshing token:", refreshError);
				}
			}

			// If refresh failed or no refresh token, clear cookies and redirect to login
			const response = NextResponse.redirect(new URL("/login", req.url));
			response.cookies.delete("token");
			response.cookies.delete("refreshToken");
			return response;
		}
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
