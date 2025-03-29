import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Create a response that redirects to the login page
		const response = NextResponse.redirect(new URL("/login", request.url));

		// Clear all auth cookies
		response.cookies.delete("token");
		response.cookies.delete("refreshToken");

		// You might also want to clear any other auth-related cookies
		response.cookies.delete("next-auth.session-token");
		response.cookies.delete("next-auth.callback-url");
		response.cookies.delete("next-auth.csrf-token");

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
	}
}
