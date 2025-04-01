"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Phone, MoreVertical, Loader2 } from "lucide-react";
import { IoVideocam } from "react-icons/io5";
import { useMessages } from "@/app/context/MessageContext";
import { useUser } from "@/app/context/UserContext";
import { format, isToday, isYesterday } from "date-fns";
import { Toaster } from "react-hot-toast";

export default function MessagesPage() {
	const { userData } = useUser();
	const {
		conversations,
		selectedConversation,
		messages,
		loadingConversations,
		loadingMessages,
		selectConversation,
		sendMessage,
	} = useMessages();

	const [newMessage, setNewMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Filter conversations based on search term
	const filteredConversations = conversations.filter(
		(conv) =>
			conv.participants[0]?.fullName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			(conv.lastMessage?.content || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
	);

	// Format timestamp for chat list
	const formatTimestamp = (timestamp: string) => {
		const date = new Date(timestamp);
		if (isToday(date)) {
			return format(date, "h:mm a");
		} else if (isYesterday(date)) {
			return "Yesterday";
		} else {
			return format(date, "MMM d");
		}
	};

	// Handle sending a message
	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		await sendMessage(newMessage);
		setNewMessage("");
	};

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div className="flex h-[calc(100vh-2rem)] gap-4">
			<Toaster position="top-right" />

			{/* Chat List */}
			<div className="w-[45%] flex flex-col bg-white rounded-lg shadow-sm">
				<div className="p-4 border-b">
					<h1 className="text-xl font-semibold mb-4">Messages</h1>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search conversations..."
							className="pl-10 bg-gray-50"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				<ScrollArea className="flex-1">
					{loadingConversations ? (
						<div className="flex items-center justify-center h-40">
							<Loader2 className="h-8 w-8 text-primary animate-spin" />
						</div>
					) : filteredConversations.length === 0 ? (
						<div className="p-4 text-center text-gray-500">
							{searchTerm
								? "No conversations match your search"
								: "No conversations yet"}
						</div>
					) : (
						<div className="p-2">
							{filteredConversations.map((conv) => (
								<div
									key={conv._id}
									className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
										selectedConversation?._id === conv._id
											? "bg-[#e9f2ff]"
											: "hover:bg-gray-50"
									}`}
									onClick={() => selectConversation(conv)}
								>
									<div className="relative">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={
													conv.participants[0]?.profileImage ||
													"/placeholder.svg?height=48&width=48"
												}
												alt={conv.participants[0]?.fullName}
											/>
											<AvatarFallback>
												{conv.participants[0]?.fullName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										{/* Online indicator would go here */}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex justify-between items-start">
											<h3 className="font-medium text-gray-900 truncate">
												{conv.participants[0]?.fullName}
											</h3>
											<span className="text-xs text-gray-500">
												{conv.lastMessage
													? formatTimestamp(conv.lastMessage.createdAt)
													: formatTimestamp(conv.createdAt)}
											</span>
										</div>
										<p className="text-sm text-gray-500 truncate">
											{conv.participants[0]?.role}
										</p>
										<p className="text-sm text-gray-600 truncate">
											{conv.lastMessage?.content || "No messages yet"}
										</p>
									</div>
									{conv.unreadCount ? (
										<span className="flex items-center justify-center w-5 h-5 bg-[#116aef] text-white text-xs rounded-full">
											{conv.unreadCount}
										</span>
									) : null}
								</div>
							))}
						</div>
					)}
				</ScrollArea>
			</div>

			{/* Chat Window */}
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm">
				{selectedConversation ? (
					<>
						<div className="flex items-center justify-between p-4 border-b">
							<div className="flex items-center gap-3">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={
											selectedConversation.participants[0]?.profileImage ||
											"/placeholder.svg?height=40&width=40"
										}
										alt={selectedConversation.participants[0]?.fullName}
									/>
									<AvatarFallback>
										{selectedConversation.participants[0]?.fullName.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="font-medium text-gray-900">
										{selectedConversation.participants[0]?.fullName}
									</h2>
									<p className="text-sm text-gray-500">
										{selectedConversation.participants[0]?.role}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon">
									<Phone className="h-5 w-5 text-[#116aef]" />
								</Button>
								<Button variant="ghost" size="icon">
									<IoVideocam className="h-5 w-5 text-[#116aef]" />
								</Button>
								<Button variant="ghost" size="icon">
									<MoreVertical className="h-5 w-5 text-[#116aef]" />
								</Button>
							</div>
						</div>

						<ScrollArea className="flex-1 p-4">
							{loadingMessages ? (
								<div className="flex items-center justify-center h-40">
									<Loader2 className="h-8 w-8 text-primary animate-spin" />
								</div>
							) : messages.length === 0 ? (
								<div className="text-center text-gray-500 py-10">
									No messages yet. Start the conversation!
								</div>
							) : (
								<div className="space-y-4">
									{messages.map((message) => (
										<div
											key={message._id}
											className={`flex ${
												message.sender._id === userData?._id
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`max-w-[70%] rounded-lg p-3 ${
													message.sender._id === userData?._id
														? "bg-[#116aef] text-white"
														: "bg-gray-100 text-gray-900"
												}`}
											>
												<p className="text-sm">{message.content}</p>
												<span
													className={`text-xs mt-1 block ${
														message.sender._id === userData?._id
															? "text-blue-100"
															: "text-gray-500"
													}`}
												>
													{format(new Date(message.createdAt), "h:mm a")}
												</span>
											</div>
										</div>
									))}
									<div ref={messagesEndRef} />
								</div>
							)}
						</ScrollArea>

						<form onSubmit={handleSendMessage} className="p-4 border-t">
							<div className="flex gap-2">
								<Input
									placeholder="Type your message..."
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									className="flex-1"
								/>
								<Button
									type="submit"
									className="bg-[#116aef] hover:bg-[#0f5ed8]"
									disabled={!newMessage.trim()}
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</form>
					</>
				) : (
					<div className="flex flex-col items-center justify-center h-full text-gray-500">
						<div className="mb-4">
							<MessageIcon className="h-16 w-16 text-gray-300" />
						</div>
						<h3 className="text-lg font-medium mb-2">
							No conversation selected
						</h3>
						<p className="text-sm text-center max-w-md">
							Select a conversation from the list or start a new one to begin
							messaging
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

// Simple message icon component
function MessageIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	);
}
