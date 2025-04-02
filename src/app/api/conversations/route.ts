import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase, Conversation, User } from "@/lib/mongoose";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

// Get all conversations for the current user
export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();

		const userId = await getDataFromToken(request);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find all conversations where the current user is a participant
		const conversations = await Conversation.find({
			participants: userId,
		})
			.populate({
				path: "participants",
				select: "fullName email role profileImage",
				match: { _id: { $ne: userId } }, // Only populate other participants
			})
			.populate({
				path: "lastMessage",
				select: "content createdAt read",
			})
			.sort({ updatedAt: -1 });

		return NextResponse.json(conversations);
	} catch (error: any) {
		console.error("Error fetching conversations:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to fetch conversations" },
			{ status: 500 }
		);
	}
}

// Create a new conversation
export async function POST(request: NextRequest) {
	try {
		await connectToDatabase();

		const userId = await getDataFromToken(request);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json().catch(() => ({}));
		const { participantId } = body;

		if (!participantId) {
			return NextResponse.json(
				{ error: "Participant ID is required" },
				{ status: 400 }
			);
		}

		// Validate that the participant exists
		const participant = await User.findById(participantId);
		if (!participant) {
			return NextResponse.json(
				{ error: "Participant not found" },
				{ status: 404 }
			);
		}

		// Ensure both IDs are valid ObjectIds
		let userObjectId, participantObjectId;
		try {
			userObjectId = new mongoose.Types.ObjectId(userId);
			participantObjectId = new mongoose.Types.ObjectId(participantId);
		} catch (error) {
			return NextResponse.json(
				{ error: "Invalid user ID format" },
				{ status: 400 }
			);
		}

		// Check if a conversation already exists between these users
		// We need to check both possible orderings of participants
		const existingConversation = await Conversation.findOne({
			participants: { $all: [userObjectId, participantObjectId] },
		}).populate({
			path: "participants",
			select: "fullName email role profileImage",
			match: { _id: { $ne: userId } },
		});

		if (existingConversation) {
			return NextResponse.json(existingConversation);
		}

		// Create a new conversation
		const newConversation = await Conversation.create({
			participants: [userObjectId, participantObjectId],
		});

		// Populate the participants
		const populatedConversation = await Conversation.findById(
			newConversation._id
		).populate({
			path: "participants",
			select: "fullName email role profileImage",
			match: { _id: { $ne: userId } },
		});

		return NextResponse.json(populatedConversation);
	} catch (error: any) {
		console.error("Error creating conversation:", error);
		return NextResponse.json(
			{
				error: error.message || "Failed to create conversation",
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
