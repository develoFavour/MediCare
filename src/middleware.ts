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

	if (isPublicPath) {
		if (token) {
			const { isValid } = verifyToken(token);
			if (isValid) {
				return NextResponse.redirect(new URL("/protected", req.url));
			}
		}
		return NextResponse.next();
	}

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	const { isValid } = verifyToken(token);
	if (isValid) {
		return NextResponse.next();
	}

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

	const response = NextResponse.redirect(new URL("/login", req.url));
	response.cookies.delete("token");
	response.cookies.delete("refreshToken");
	return response;
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
