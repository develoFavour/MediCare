import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function verifyToken(token: string): { isValid: boolean; payload: any } {
	try {
		// Simple JWT verification without crypto
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
	const isPublicPath =
		path === "/login" ||
		path === "/signup" ||
		path === "/" ||
		path.startsWith("/doctors") ||
		path.startsWith("/services") ||
		path.startsWith("/blogs");

	const token = req.cookies.get("token")?.value || "";
	const refreshToken = req.cookies.get("refreshToken")?.value || "";

	console.log(
		`Path: ${path}, Token: ${token ? "exists" : "not found"}, RefreshToken: ${
			refreshToken ? "exists" : "not found"
		}`
	);

	if (isPublicPath) {
		if (token) {
			const { isValid, payload } = verifyToken(token);
			if (isValid) {
				console.log(
					"Token verified on public path, redirecting to protected route"
				);
				return NextResponse.redirect(new URL("/protected", req.url));
			} else {
				console.error("Token verification failed on public path");
				const response = NextResponse.next();
				response.cookies.delete("token");
				response.cookies.delete("refreshToken");
				return response;
			}
		}
		return NextResponse.next();
	}

	if (!token) {
		console.log("No token found, redirecting to login");
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const { isValid, payload } = verifyToken(token);
	if (isValid) {
		console.log("Token verified successfully");
		return NextResponse.next();
	} else {
		console.error("Token verification failed");
		if (refreshToken) {
			try {
				console.log("Attempting to refresh token");
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
						console.log("Token refreshed successfully");
						const res = NextResponse.next();
						res.cookies.set("token", newToken, {
							httpOnly: true,
							secure: process.env.NODE_ENV === "production",
							sameSite: "strict",
							maxAge: 60 * 60,
						});
						return res;
					}
				} else {
					console.error("Token refresh failed:", await response.text());
				}
			} catch (refreshError) {
				console.error("Error refreshing token:", refreshError);
			}
		}

		console.log("Refresh failed or no refresh token, redirecting to login");
		const response = NextResponse.redirect(new URL("/login", req.url));
		response.cookies.delete("token");
		response.cookies.delete("refreshToken");
		return response;
	}
}

export const config = {
	matcher: [
		"/",
		"/login",
		"/signup",
		"/doctors",
		"/services",
		"/blogs/:path*",
		"/patient/:path*",
		"/doctor/:path*",
		"/admin/:path*",
		"/protected",
	],
};
