"use client";

import type React from "react";
import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useRef,
} from "react";
import { useUser } from "./UserContext";
import { toast } from "react-hot-toast";
import {
	pusherClient,
	getConversationChannelName,
	getPresenceChannelName,
	getUserChannelName,
} from "@/lib/pusher";
import type { Channel, PresenceChannel } from "pusher-js";

interface Participant {
	_id: string;
	fullName: string;
	email: string;
	role: string;
	profileImage?: string;
}

interface LastMessage {
	_id: string;
	content: string;
	createdAt: string;
	read: boolean;
}

export interface Conversation {
	_id: string;
	participants: Participant[];
	lastMessage?: LastMessage;
	updatedAt: string;
	createdAt: string;
	unreadCount?: number;
}

export interface Message {
	_id: string;
	conversation: string;
	sender: {
		_id: string;
		fullName: string;
		role: string;
		profileImage?: string;
	};
	content: string;
	read: boolean;
	delivered: boolean;
	createdAt: string;
	updatedAt: string;
}

interface UserTyping {
	_id: string;
	fullName: string;
	isTyping: boolean;
}

interface OnlineUser {
	_id: string;
	fullName: string;
	role: string;
	profileImage?: string;
}

interface MessageContextType {
	conversations: Conversation[];
	selectedConversation: Conversation | null;
	messages: Message[];
	loadingConversations: boolean;
	loadingMessages: boolean;
	userTyping: UserTyping | null;
	onlineUsers: OnlineUser[];
	selectConversation: (conversation: Conversation) => void;
	sendMessage: (content: string) => Promise<void>;
	refreshConversations: () => Promise<void>;
	startConversation: (participantId: string) => Promise<Conversation | null>;
	setTyping: (isTyping: boolean) => void;
	markMessageAsRead: (messageId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { userData } = useUser();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
	const [userTyping, setUserTyping] = useState<UserTyping | null>(null);
	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const conversationChannelRef = useRef<Channel | null>(null);
	const presenceChannelRef = useRef<PresenceChannel | null>(null);
	const userChannelRef = useRef<Channel | null>(null);

	// Subscribe to user's private channel for notifications
	useEffect(() => {
		if (!userData?._id) return;

		const userChannel = pusherClient.subscribe(
			getUserChannelName(userData._id)
		);
		userChannelRef.current = userChannel;

		// Listen for new message notifications
		userChannel.bind(
			"new-message",
			(data: { conversationId: string; message: Message }) => {
				// If the message is not for the currently selected conversation, show a notification
				if (
					!selectedConversation ||
					data.conversationId !== selectedConversation._id
				) {
					// Update unread counts
					setUnreadCounts((prev) => ({
						...prev,
						[data.conversationId]: (prev[data.conversationId] || 0) + 1,
					}));

					// Update conversations list
					setConversations((prev) => {
						const updatedConversations = [...prev];
						const index = updatedConversations.findIndex(
							(c) => c._id === data.conversationId
						);

						if (index !== -1) {
							updatedConversations[index] = {
								...updatedConversations[index],
								lastMessage: {
									_id: data.message._id,
									content: data.message.content,
									createdAt: data.message.createdAt,
									read: false,
								},
								updatedAt: new Date().toISOString(),
								unreadCount: (updatedConversations[index].unreadCount || 0) + 1,
							};

							// Sort conversations by updatedAt
							updatedConversations.sort(
								(a, b) =>
									new Date(b.updatedAt).getTime() -
									new Date(a.updatedAt).getTime()
							);
						}

						return updatedConversations;
					});

					// Show toast notification
					toast.custom(
						(t) => (
							<div
								className={`${
									t.visible ? "animate-enter" : "animate-leave"
								} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
							>
								<div className="flex-1 p-4">
									<div className="flex items-start">
										<div className="ml-3 flex-1">
											<p className="text-sm font-medium text-gray-900">
												{data.message.sender.fullName}
											</p>
											<p className="mt-1 text-sm text-gray-500 truncate">
												{data.message.content}
											</p>
										</div>
									</div>
								</div>
								<div className="flex border-l border-gray-200">
									<button
										onClick={() => {
											// Find the conversation and select it
											const conv = conversations.find(
												(c) => c._id === data.conversationId
											);
											if (conv) selectConversation(conv);
											toast.dismiss(t.id);
										}}
										className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
									>
										View
									</button>
								</div>
							</div>
						),
						{ duration: 5000 }
					);
				}
			}
		);

		// Listen for message read receipts
		userChannel.bind(
			"message-read",
			(data: { conversationId: string; messageId: string }) => {
				// Update message read status
				setMessages((prev) =>
					prev.map((msg) =>
						msg._id === data.messageId ? { ...msg, read: true } : msg
					)
				);
			}
		);

		// Listen for message delivered receipts
		userChannel.bind(
			"message-delivered",
			(data: { conversationId: string; messageId: string }) => {
				// Update message delivered status
				setMessages((prev) =>
					prev.map((msg) =>
						msg._id === data.messageId ? { ...msg, delivered: true } : msg
					)
				);
			}
		);

		return () => {
			userChannel.unbind_all();
			pusherClient.unsubscribe(getUserChannelName(userData._id));
		};
	}, [userData?._id, selectedConversation, conversations]);

	// Subscribe to conversation channel when a conversation is selected
	useEffect(() => {
		if (!selectedConversation || !userData?._id) return;

		// Unsubscribe from previous channels
		if (conversationChannelRef.current) {
			conversationChannelRef.current.unbind_all();
			pusherClient.unsubscribe(conversationChannelRef.current.name);
			conversationChannelRef.current = null;
		}

		if (presenceChannelRef.current) {
			presenceChannelRef.current.unbind_all();
			pusherClient.unsubscribe(presenceChannelRef.current.name);
			presenceChannelRef.current = null;
		}

		// Subscribe to private conversation channel
		const conversationChannel = pusherClient.subscribe(
			getConversationChannelName(selectedConversation._id)
		);
		conversationChannelRef.current = conversationChannel;

		// Listen for new messages
		conversationChannel.bind("new-message", (message: Message) => {
			// Add message to the list
			setMessages((prev) => [...prev, message]);

			// Mark as delivered if from another user
			if (message.sender._id !== userData._id) {
				markMessageAsDelivered(message._id);
			}
		});

		// Subscribe to presence channel for online status and typing
		const presenceChannel = pusherClient.subscribe(
			getPresenceChannelName(selectedConversation._id)
		) as PresenceChannel;
		presenceChannelRef.current = presenceChannel;

		// Handle presence events
		presenceChannel.bind("pusher:subscription_succeeded", () => {
			const members = presenceChannel.members;
			const users: OnlineUser[] = [];

			members.each((member: any) => {
				if (member.id !== userData._id) {
					users.push({
						_id: member.id,
						fullName: member.info.name,
						role: member.info.role,
						profileImage: member.info.profileImage,
					});
				}
			});

			setOnlineUsers(users);
		});

		presenceChannel.bind("pusher:member_added", (member: any) => {
			if (member.id !== userData._id) {
				setOnlineUsers((prev) => [
					...prev,
					{
						_id: member.id,
						fullName: member.info.name,
						role: member.info.role,
						profileImage: member.info.profileImage,
					},
				]);
			}
		});

		presenceChannel.bind("pusher:member_removed", (member: any) => {
			setOnlineUsers((prev) => prev.filter((user) => user._id !== member.id));

			// Clear typing indicator if the user who left was typing
			if (userTyping && userTyping._id === member.id) {
				setUserTyping(null);
			}
		});

		// Listen for typing indicators
		presenceChannel.bind(
			"typing",
			(data: { userId: string; fullName: string; isTyping: boolean }) => {
				if (data.userId !== userData._id) {
					if (data.isTyping) {
						setUserTyping({
							_id: data.userId,
							fullName: data.fullName,
							isTyping: true,
						});
					} else {
						setUserTyping(null);
					}
				}
			}
		);

		// Mark all unread messages as read when opening the conversation
		if (
			selectedConversation.unreadCount &&
			selectedConversation.unreadCount > 0
		) {
			markConversationAsRead(selectedConversation._id);
		}

		return () => {
			if (conversationChannelRef.current) {
				conversationChannelRef.current.unbind_all();
				pusherClient.unsubscribe(conversationChannelRef.current.name);
				conversationChannelRef.current = null;
			}

			if (presenceChannelRef.current) {
				presenceChannelRef.current.unbind_all();
				pusherClient.unsubscribe(presenceChannelRef.current.name);
				presenceChannelRef.current = null;
			}
		};
	}, [selectedConversation, userData?._id]);

	// Fetch conversations
	const fetchConversations = useCallback(async () => {
		if (!userData?._id) return;

		try {
			setLoadingConversations(true);
			const response = await fetch("/api/conversations");

			if (!response.ok) {
				throw new Error("Failed to fetch conversations");
			}

			const data = await response.json();
			setConversations(data);
		} catch (error) {
			console.error("Error fetching conversations:", error);
			toast.error("Failed to load conversations");
		} finally {
			setLoadingConversations(false);
		}
	}, [userData?._id]);

	// Fetch unread counts
	const fetchUnreadCounts = useCallback(async () => {
		if (!userData?._id) return;

		try {
			const response = await fetch("/api/conversations/unread");

			if (!response.ok) {
				throw new Error("Failed to fetch unread counts");
			}

			const data = await response.json();
			setUnreadCounts(data);
		} catch (error) {
			console.error("Error fetching unread counts:", error);
		}
	}, [userData?._id]);

	// Fetch messages for selected conversation
	const fetchMessages = useCallback(async (conversationId: string) => {
		try {
			setLoadingMessages(true);
			const response = await fetch(
				`/api/conversations/${conversationId}/messages`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch messages");
			}

			const data = await response.json();
			setMessages(data);
		} catch (error) {
			console.error("Error fetching messages:", error);
			toast.error("Failed to load messages");
		} finally {
			setLoadingMessages(false);
		}
	}, []);

	// Mark conversation as read
	const markConversationAsRead = async (conversationId: string) => {
		try {
			await fetch(`/api/conversations/${conversationId}/read`, {
				method: "POST",
			});

			// Update unread counts locally
			setUnreadCounts((prev) => ({
				...prev,
				[conversationId]: 0,
			}));

			// Update conversation in the list
			setConversations((prev) =>
				prev.map((conv) =>
					conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
				)
			);
		} catch (error) {
			console.error("Error marking conversation as read:", error);
		}
	};

	// Mark message as read
	const markMessageAsRead = async (messageId: string) => {
		try {
			await fetch(`/api/messages/${messageId}/read`, {
				method: "POST",
			});

			// Update message in the list
			setMessages((prev) =>
				prev.map((msg) =>
					msg._id === messageId ? { ...msg, read: true } : msg
				)
			);
		} catch (error) {
			console.error("Error marking message as read:", error);
		}
	};

	// Mark message as delivered
	const markMessageAsDelivered = async (messageId: string) => {
		try {
			await fetch(`/api/messages/${messageId}/delivered`, {
				method: "POST",
			});

			// Update message in the list
			setMessages((prev) =>
				prev.map((msg) =>
					msg._id === messageId ? { ...msg, delivered: true } : msg
				)
			);
		} catch (error) {
			console.error("Error marking message as delivered:", error);
		}
	};

	// Select a conversation
	const selectConversation = useCallback(
		(conversation: Conversation) => {
			setSelectedConversation(conversation);
			fetchMessages(conversation._id);

			// Mark conversation as read
			if (conversation.unreadCount && conversation.unreadCount > 0) {
				markConversationAsRead(conversation._id);
			}
		},
		[fetchMessages]
	);

	// Send a message
	const sendMessage = useCallback(
		async (content: string) => {
			if (!selectedConversation || !userData?._id) {
				toast.error("No conversation selected");
				return;
			}

			try {
				const response = await fetch(
					`/api/conversations/${selectedConversation._id}/messages`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ content }),
					}
				);

				if (!response.ok) {
					throw new Error("Failed to send message");
				}

				const newMessage = await response.json();

				// Update messages locally
				setMessages((prev) => [...prev, newMessage]);

				// Update conversations list with new last message
				setConversations((prev) => {
					const updatedConversations = [...prev];
					const index = updatedConversations.findIndex(
						(c) => c._id === selectedConversation._id
					);

					if (index !== -1) {
						updatedConversations[index] = {
							...updatedConversations[index],
							lastMessage: {
								_id: newMessage._id,
								content: newMessage.content,
								createdAt: newMessage.createdAt,
								read: newMessage.read,
							},
							updatedAt: new Date().toISOString(),
						};

						// Sort conversations by updatedAt
						updatedConversations.sort(
							(a, b) =>
								new Date(b.updatedAt).getTime() -
								new Date(a.updatedAt).getTime()
						);
					}

					return updatedConversations;
				});
			} catch (error) {
				console.error("Error sending message:", error);
				toast.error("Failed to send message");
			}
		},
		[selectedConversation, userData?._id]
	);

	// Start a new conversation
	const startConversation = useCallback(
		async (participantId: string) => {
			if (!userData?._id) {
				toast.error("You must be logged in to start a conversation");
				return null;
			}

			try {
				const response = await fetch("/api/conversations", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ participantId }),
				});

				// Check if response is OK before trying to parse JSON
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Error response:", errorText);
					throw new Error(
						`Failed to start conversation: ${response.status} ${response.statusText}`
					);
				}

				const newConversation = await response.json();

				// Check if this conversation already exists in our list
				const existingIndex = conversations.findIndex(
					(c) => c._id === newConversation._id
				);

				if (existingIndex === -1) {
					// Add to conversations list
					setConversations((prev) => [newConversation, ...prev]);
				}

				// Select the conversation
				selectConversation(newConversation);

				return newConversation;
			} catch (error: any) {
				console.error("Error starting conversation:", error);
				toast.error(error.message || "Failed to start conversation");
				return null;
			}
		},
		[userData?._id, conversations, selectConversation]
	);

	// Refresh conversations
	const refreshConversations = useCallback(async () => {
		await fetchConversations();
		await fetchUnreadCounts();
	}, [fetchConversations, fetchUnreadCounts]);

	// Set typing indicator
	const setTyping = useCallback(
		(isTyping: boolean) => {
			if (!presenceChannelRef.current || !selectedConversation || !userData)
				return;

			// Clear any existing timeout
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			// Trigger typing event
			presenceChannelRef.current.trigger("client-typing", {
				userId: userData._id,
				fullName: userData.fullName,
				isTyping,
			});

			// If user is typing, set a timeout to automatically clear typing indicator after 3 seconds
			if (isTyping) {
				typingTimeoutRef.current = setTimeout(() => {
					if (presenceChannelRef.current && selectedConversation) {
						presenceChannelRef.current.trigger("client-typing", {
							userId: userData._id,
							fullName: userData.fullName,
							isTyping: false,
						});
					}
				}, 3000);
			}
		},
		[selectedConversation, userData]
	);

	// Initial data loading
	useEffect(() => {
		if (userData?._id) {
			fetchConversations();
			fetchUnreadCounts();
		}
	}, [userData?._id, fetchConversations, fetchUnreadCounts]);

	// Combine conversations with unread counts
	const conversationsWithUnread = conversations.map((conv) => ({
		...conv,
		unreadCount: unreadCounts[conv._id] || conv.unreadCount || 0,
	}));

	const value = {
		conversations: conversationsWithUnread,
		selectedConversation,
		messages,
		loadingConversations,
		loadingMessages,
		userTyping,
		onlineUsers,
		selectConversation,
		sendMessage,
		refreshConversations,
		startConversation,
		setTyping,
		markMessageAsRead,
	};

	return (
		<MessageContext.Provider value={value}>{children}</MessageContext.Provider>
	);
};

export const useMessages = () => {
	const context = useContext(MessageContext);
	if (context === undefined) {
		throw new Error("useMessages must be used within a MessageProvider");
	}
	return context;
};
