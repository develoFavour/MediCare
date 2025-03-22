import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (!refreshToken) {
		return NextResponse.json(
			{ error: "No refresh token provided" },
			{ status: 401 }
		);
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET!
		) as jwt.JwtPayload;

		const newToken = jwt.sign(
			{ id: decoded.id, email: decoded.email, role: decoded.role },
			process.env.TOKEN_SECRET!,
			{ expiresIn: "1h" }
		);

		const response = NextResponse.json({ token: newToken, success: true });
		response.cookies.set("token", newToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60, // 1 hour in seconds
		});

		return response;
	} catch (error) {
		console.error("Refresh token verification failed:", error);
		return NextResponse.json(
			{ error: "Invalid refresh token" },
			{ status: 401 }
		);
	}
}
