import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Message from "@/models/messageModel";
import Conversation from "@/models/conversationModel";
import { pusherServer } from "@/lib/pusher";
import { getUserChannelName } from "@/lib/pusher";

// Connect to database
connect();

export async function POST(
	request: NextRequest,
	{ params }: { params: { conversationId: string } }
) {
	try {
		const userId = await getDataFromToken(request);

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { conversationId } = params;

		// Validate that the conversation exists and the user is a participant
		const conversation = await Conversation.findOne({
			_id: conversationId,
			participants: userId,
		});

		if (!conversation) {
			return NextResponse.json(
				{ error: "Conversation not found or you don't have access" },
				{ status: 404 }
			);
		}

		// Mark all unread messages as read
		const messages = await Message.find({
			conversation: conversationId,
			sender: { $ne: userId },
			read: false,
		});

		// Update all messages
		await Message.updateMany(
			{
				conversation: conversationId,
				sender: { $ne: userId },
				read: false,
			},
			{ read: true, delivered: true }
		);

		// Notify senders that their messages were read
		// Using Array.from instead of spread operator with Set
		const senderIds = Array.from(
			new Set(messages.map((msg) => msg.sender.toString()))
		);

		for (const senderId of senderIds) {
			const messageIds = messages
				.filter((msg) => msg.sender.toString() === senderId)
				.map((msg) => msg._id.toString());

			// Trigger event on each sender's channel
			for (const messageId of messageIds) {
				await pusherServer.trigger(
					getUserChannelName(senderId),
					"message-read",
					{
						conversationId,
						messageId,
					}
				);
			}
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Error marking conversation as read:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to mark conversation as read" },
			{ status: 500 }
		);
	}
}
