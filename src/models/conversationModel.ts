import mongoose, { Schema, type Document } from "mongoose";

export interface IConversation extends Document {
	participants: mongoose.Types.ObjectId[];
	lastMessage?: mongoose.Types.ObjectId;
	updatedAt: Date;
	createdAt: Date;
}

const ConversationSchema: Schema = new Schema(
	{
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		lastMessage: {
			type: Schema.Types.ObjectId,
			ref: "Message",
		},
	},
	{ timestamps: true }
);

// Create a unique compound index on participants to prevent duplicate conversations
ConversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.models.Conversation ||
	mongoose.model<IConversation>("Conversation", ConversationSchema);
