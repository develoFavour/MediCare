import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Message from "@/models/messageModel";
import Conversation from "@/models/conversationModel";

// Connect to database
connect();

// Get unread message counts for all conversations
export async function GET(request: NextRequest) {
	try {
		const userId = await getDataFromToken(request);

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find all conversations where the user is a participant
		const conversations = await Conversation.find({
			participants: userId,
		});

		const conversationIds = conversations.map((conv) => conv._id);

		// Get unread message counts for each conversation
		const unreadCounts = await Message.aggregate([
			{
				$match: {
					conversation: { $in: conversationIds },
					sender: { $ne: userId },
					read: false,
				},
			},
			{
				$group: {
					_id: "$conversation",
					count: { $sum: 1 },
				},
			},
		]);

		// Convert to a more usable format
		const unreadCountsMap = unreadCounts.reduce((acc, item) => {
			acc[item._id.toString()] = item.count;
			return acc;
		}, {} as Record<string, number>);

		return NextResponse.json(unreadCountsMap);
	} catch (error: any) {
		console.error("Error fetching unread counts:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to fetch unread counts" },
			{ status: 500 }
		);
	}
}
