import Pusher from "pusher";
import PusherClient from "pusher-js";

// Check if required environment variables are set
if (!process.env.PUSHER_APP_ID) {
	console.error("PUSHER_APP_ID is not defined");
}
if (!process.env.PUSHER_KEY) {
	console.error("PUSHER_KEY is not defined");
}
if (!process.env.PUSHER_SECRET) {
	console.error("PUSHER_SECRET is not defined");
}
if (!process.env.PUSHER_CLUSTER) {
	console.error("PUSHER_CLUSTER is not defined");
}
if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
	console.error("NEXT_PUBLIC_PUSHER_KEY is not defined");
}
if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
	console.error("NEXT_PUBLIC_PUSHER_CLUSTER is not defined");
}

// Server-side Pusher instance
export const pusherServer = new Pusher({
	appId: process.env.PUSHER_APP_ID || "",
	key: process.env.PUSHER_KEY || "",
	secret: process.env.PUSHER_SECRET || "",
	cluster: process.env.PUSHER_CLUSTER || "eu", // Default to 'eu' if not provided
	useTLS: true,
});

// Client-side Pusher instance
export const pusherClient = new PusherClient(
	process.env.NEXT_PUBLIC_PUSHER_KEY || "",
	{
		cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu", // Default to 'eu' if not provided
		forceTLS: true,
		authEndpoint: "/api/pusher/auth",
	}
);

// Helper function to get a channel name for a conversation
export const getConversationChannelName = (conversationId: string) =>
	`private-conversation-${conversationId}`;

// Helper function to get a presence channel name for a conversation
export const getPresenceChannelName = (conversationId: string) =>
	`presence-conversation-${conversationId}`;

// Helper function to get a user channel name
export const getUserChannelName = (userId: string) => `private-user-${userId}`;
