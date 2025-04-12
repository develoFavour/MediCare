export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";
import User from "@/models/userModel";
import Conversation from "@/models/conversationModel";

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

		console.log(
			`Checking for existing conversation between ${userId} and ${participantId}`
		);

		// Fix: Use a better query to find existing conversations
		const existingConversation = await Conversation.findOne({
			participants: { $all: [userObjectId, participantObjectId] },
		}).populate({
			path: "participants",
			select: "fullName email role profileImage",
			match: { _id: { $ne: userId } },
		});

		if (existingConversation) {
			console.log(`Found existing conversation: ${existingConversation._id}`);
			return NextResponse.json(existingConversation);
		}

		console.log(
			`No existing conversation found, creating new one between ${userId} and ${participantId}`
		);

		// If we get here, no existing conversation was found, so create a new one
		try {
			// Create a new conversation with both participants
			const newConversation = new Conversation({
				participants: [userObjectId, participantObjectId],
			});

			// Save the conversation
			await newConversation.save();

			// Populate the participants
			const populatedConversation = await Conversation.findById(
				newConversation._id
			).populate({
				path: "participants",
				select: "fullName email role profileImage",
				match: { _id: { $ne: userId } },
			});

			console.log(`Created new conversation: ${newConversation._id}`);
			return NextResponse.json(populatedConversation);
		} catch (error: any) {
			// If we get any error, try one more time to find the conversation
			// This handles race conditions where the conversation might have been created
			// by another request between our check and creation
			console.log(
				"Error creating conversation, checking if it exists now:",
				error.message
			);

			const retryConversation = await Conversation.findOne({
				participants: { $all: [userObjectId, participantObjectId] },
			}).populate({
				path: "participants",
				select: "fullName email role profileImage",
				match: { _id: { $ne: userId } },
			});

			if (retryConversation) {
				console.log(`Found conversation on retry: ${retryConversation._id}`);
				return NextResponse.json(retryConversation);
			}

			throw error;
		}
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
