// app/api/users/logout/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Create a response object
		const response = NextResponse.json(
			{ success: true, message: "Logged out successfully" },
			{ status: 200 }
		);

		// Clear all auth cookies
		response.cookies.delete("token");
		response.cookies.delete("refreshToken");

		// Clear any other auth-related cookies
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
