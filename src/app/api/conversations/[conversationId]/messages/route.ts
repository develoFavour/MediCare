import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Conversation from "@/models/conversationModel";
import Message from "@/models/messageModel";
import { pusherServer } from "@/lib/pusher";
import { getConversationChannelName, getUserChannelName } from "@/lib/pusher";

// Connect to database
connect();

// Get all messages for a conversation
export async function GET(
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

		// Get messages for the conversation
		const messages = await Message.find({
			conversation: conversationId,
		})
			.sort({ createdAt: 1 })
			.populate({
				path: "sender",
				select: "fullName role profileImage",
			});

		// Mark all unread messages as delivered
		await Message.updateMany(
			{
				conversation: conversationId,
				sender: { $ne: userId },
				delivered: false,
			},
			{ delivered: true }
		);

		// Find messages that were just marked as delivered
		const deliveredMessages = await Message.find({
			conversation: conversationId,
			sender: { $ne: userId },
			delivered: true,
			read: false,
		});

		// Notify senders that their messages were delivered
		// Using Array.from instead of spread operator with Set
		const senderIds = Array.from(
			new Set(deliveredMessages.map((msg) => msg.sender.toString()))
		);

		for (const senderId of senderIds) {
			const messageIds = deliveredMessages
				.filter((msg) => msg.sender.toString() === senderId)
				.map((msg) => msg._id.toString());

			// Trigger event on each sender's channel
			for (const messageId of messageIds) {
				await pusherServer.trigger(
					getUserChannelName(senderId),
					"message-delivered",
					{
						conversationId,
						messageId,
					}
				);
			}
		}

		return NextResponse.json(messages);
	} catch (error: any) {
		console.error("Error fetching messages:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to fetch messages" },
			{ status: 500 }
		);
	}
}

// Send a new message
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
		const { content } = await request.json();

		if (!content) {
			return NextResponse.json(
				{ error: "Message content is required" },
				{ status: 400 }
			);
		}

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

		// Create a new message
		const newMessage = await Message.create({
			conversation: conversationId,
			sender: userId,
			content,
		});

		// Update the conversation's lastMessage and updatedAt
		await Conversation.findByIdAndUpdate(conversationId, {
			lastMessage: newMessage._id,
			updatedAt: new Date(),
		});

		// Populate the sender
		const populatedMessage = await Message.findById(newMessage._id).populate({
			path: "sender",
			select: "fullName role profileImage",
		});

		// Trigger Pusher event for new message
		await pusherServer.trigger(
			getConversationChannelName(conversationId),
			"new-message",
			populatedMessage
		);

		// Notify other participants
		const otherParticipants = conversation.participants
			.filter((p: string | any) => p.toString() !== userId)
			.map((p: string | any) => p.toString());

		for (const participantId of otherParticipants) {
			await pusherServer.trigger(
				getUserChannelName(participantId),
				"new-message",
				{
					conversationId,
					message: populatedMessage,
				}
			);
		}

		return NextResponse.json(populatedMessage);
	} catch (error: any) {
		console.error("Error sending message:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to send message" },
			{ status: 500 }
		);
	}
}
