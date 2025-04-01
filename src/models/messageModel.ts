import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
	conversation: mongoose.Types.ObjectId;
	sender: mongoose.Types.ObjectId;
	content: string;
	read: boolean;
	delivered: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
	{
		conversation: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
		delivered: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Message ||
	mongoose.model<IMessage>("Message", MessageSchema);
