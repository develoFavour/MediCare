import { type NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { pusherServer } from "@/lib/pusher";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
	try {
		const userId = await getDataFromToken(request);

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse form data with error handling
		const formData = await request.formData().catch((err) => {
			console.error("Error parsing form data:", err);
			return new FormData();
		});

		const socketId = formData.get("socket_id") as string;
		const channel = formData.get("channel_name") as string;

		if (!socketId || !channel) {
			return NextResponse.json(
				{
					error: "Missing required parameters",
					details: { socketId: !!socketId, channel: !!channel },
				},
				{ status: 400 }
			);
		}

		// For presence channels, we need to provide user info
		if (channel.startsWith("presence-")) {
			// Get user data for presence channel
			const user = await User.findById(userId).select(
				"fullName role profileImage"
			);

			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}

			// Auth with user data
			const authResponse = pusherServer.authorizeChannel(socketId, channel, {
				user_id: userId,
				user_info: {
					name: user.fullName,
					role: user.role,
					profileImage: user.profileImage || null,
				},
			});

			return NextResponse.json(authResponse);
		}

		// For private channels, we need to provide a user_id for authentication
		if (channel.startsWith("private-")) {
			const authResponse = pusherServer.authorizeChannel(socketId, channel, {
				user_id: userId,
			});
			return NextResponse.json(authResponse);
		}

		return NextResponse.json(
			{ error: "Invalid channel type" },
			{ status: 400 }
		);
	} catch (error: any) {
		console.error("Pusher auth error:", error);
		// Always return JSON, even for errors
		return NextResponse.json(
			{
				error: error.message || "Authentication failed",
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
