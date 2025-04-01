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
	{ params }: { params: { messageId: string } }
) {
	try {
		const userId = await getDataFromToken(request);

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { messageId } = params;

		// Find the message
		const message = await Message.findById(messageId).populate({
			path: "conversation",
			select: "participants",
		});

		if (!message) {
			return NextResponse.json({ error: "Message not found" }, { status: 404 });
		}

		// Only mark as delivered if the current user is not the sender
		if (message.sender.toString() !== userId) {
			message.delivered = true;
			await message.save();

			// Notify the sender that the message was delivered
			const conversation = await Conversation.findById(message.conversation);
			if (conversation) {
				const senderId = message.sender.toString();

				// Trigger event on the sender's channel
				await pusherServer.trigger(
					getUserChannelName(senderId),
					"message-delivered",
					{
						conversationId: message.conversation._id.toString(),
						messageId: message._id.toString(),
					}
				);
			}
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Error marking message as delivered:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to mark message as delivered" },
			{ status: 500 }
		);
	}
}
