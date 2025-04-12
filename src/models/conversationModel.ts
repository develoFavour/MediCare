import mongoose, { Schema, type Document } from "mongoose";

export interface IConversation extends Document {
	participants: mongoose.Types.ObjectId[];
	lastMessage?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const ConversationSchema = new Schema(
	{
		participants: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
			required: true,
		},
		lastMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	},
	{ timestamps: true }
);

// Remove any existing index on participants
ConversationSchema.index({ participants: 1 }, { unique: false });

// Create a compound index that ensures uniqueness across the entire participants array
// This prevents duplicate conversations between the same set of users
ConversationSchema.index(
	{ participants: 1 },
	{
		unique: true,
		partialFilterExpression: { participants: { $exists: true } },
		background: true,
	}
);

export default mongoose.models.Conversation ||
	mongoose.model<IConversation>("Conversation", ConversationSchema);
