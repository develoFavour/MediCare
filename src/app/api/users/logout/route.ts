import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const response = NextResponse.json(
			{ success: true, message: "Logged out successfully" },
			{ status: 200 }
		);

		response.cookies.set("token", "", {
			path: "/",
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: "strict",
			maxAge: 0,
			expires: new Date(0),
		});

		response.cookies.set("refreshToken", "", {
			path: "/",
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
			sameSite: "strict",
			maxAge: 0,
			expires: new Date(0),
		});

		response.cookies.delete("next-auth.session-token");
		response.cookies.delete("next-auth.callback-url");
		response.cookies.delete("next-auth.csrf-token");

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to logout" },
			{ status: 500 }
		);
	}
}
