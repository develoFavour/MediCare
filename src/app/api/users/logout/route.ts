import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Create the response object
		const response = NextResponse.json(
			{
				message: "Logout successful",
				success: true,
			},
			{ status: 200 }
		);

		// Clear both token and refreshToken cookies with secure options
		response.cookies.set("token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			expires: new Date(0),
		});

		response.cookies.set("refreshToken", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			expires: new Date(0),
		});

		return response;
	} catch (error: any) {
		console.error("Logout error:", error);

		return NextResponse.json(
			{
				error: "An error occurred during logout",
				success: false,
			},
			{ status: 500 }
		);
	}
}
