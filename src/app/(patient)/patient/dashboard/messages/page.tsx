"use client";

import "@/app/(root)/globals.css";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Phone, MoreVertical } from "lucide-react";

import { IoVideocam } from "react-icons/io5";

interface Message {
	id: string;
	content: string;
	sender: "user" | "doctor";
	timestamp: string;
}

interface Chat {
	id: string;
	name: string;
	role: string;
	avatar: string;
	lastMessage: string;
	time: string;
	unread: number;
	online: boolean;
}

const sampleChats: Chat[] = [
	{
		id: "1",
		name: "Dr. David Smith",
		role: "Cardiologist",
		avatar: "/img/avatar.jpg",
		lastMessage: "Your latest test results look good",
		time: "10:30 AM",
		unread: 2,
		online: true,
	},
	{
		id: "2",
		name: "Dr. Sarah Johnson",
		role: "Neurologist",
		avatar: "/img/avatar.jpg",
		lastMessage: "Please remember to take your medication",
		time: "Yesterday",
		unread: 0,
		online: false,
	},
	{
		id: "3",
		name: "Dr. Michael Chen",
		role: "Primary Care",
		avatar: "/img/avatar.jpg",
		lastMessage: "See you at your next appointment",
		time: "Yesterday",
		unread: 1,
		online: true,
	},
];

const sampleMessages: Message[] = [
	{
		id: "1",
		content: "Good morning! How are you feeling today?",
		sender: "doctor",
		timestamp: "10:00 AM",
	},
	{
		id: "2",
		content: "I'm feeling much better, thank you doctor.",
		sender: "user",
		timestamp: "10:05 AM",
	},
	{
		id: "3",
		content: "Have you been taking your medication regularly?",
		sender: "doctor",
		timestamp: "10:10 AM",
	},
	{
		id: "4",
		content: "Yes, I've been following the prescription exactly as advised.",
		sender: "user",
		timestamp: "10:15 AM",
	},
];

export default function MessagesPage() {
	const [selectedChat, setSelectedChat] = useState<Chat>(sampleChats[0]);
	const [newMessage, setNewMessage] = useState("");

	return (
		<div className="flex h-[calc(100vh-2rem)] gap-4 p-6">
			{/* Chat List */}
			<div className="w-[45%] flex flex-col bg-white rounded-lg shadow-sm">
				<div className="p-4 border-b">
					<h1 className="text-xl font-semibold mb-4">Messages</h1>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search conversations..."
							className="pl-10 bg-gray-50"
						/>
					</div>
				</div>
				<ScrollArea className="flex-1">
					<div className="p-2">
						{sampleChats.map((chat) => (
							<div
								key={chat.id}
								className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
									selectedChat.id === chat.id
										? "bg-[#e9f2ff]"
										: "hover:bg-gray-50"
								}`}
								onClick={() => setSelectedChat(chat)}
							>
								<div className="relative">
									<Avatar className="h-12 w-12">
										<AvatarImage src={chat.avatar} alt={chat.name} />
										<AvatarFallback>{chat.name[0]}</AvatarFallback>
									</Avatar>
									{chat.online && (
										<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start">
										<h3 className="font-medium text-gray-900 truncate">
											{chat.name}
										</h3>
										<span className="text-xs text-gray-500">{chat.time}</span>
									</div>
									<p className="text-sm text-gray-500 truncate">{chat.role}</p>
									<p className="text-sm text-gray-600 truncate">
										{chat.lastMessage}
									</p>
								</div>
								{chat.unread > 0 && (
									<span className="flex items-center justify-center w-5 h-5 bg-[#116aef] text-white text-xs rounded-full">
										{chat.unread}
									</span>
								)}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* Chat Window */}
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm">
				<div className="flex items-center justify-between p-4 border-b">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
							<AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="font-medium text-gray-900">{selectedChat.name}</h2>
							<p className="text-sm text-gray-500">{selectedChat.role}</p>
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
					<div className="space-y-4">
						{sampleMessages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.sender === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-[70%] rounded-lg p-3 ${
										message.sender === "user"
											? "bg-[#116aef] text-white"
											: "bg-gray-100 text-gray-900"
									}`}
								>
									<p className="text-sm">{message.content}</p>
									<span
										className={`text-xs mt-1 block ${
											message.sender === "user"
												? "text-blue-100"
												: "text-gray-500"
										}`}
									>
										{message.timestamp}
									</span>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>

				<div className="p-4 border-t">
					<div className="flex gap-2">
						<Input
							placeholder="Type your message..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							className="flex-1"
						/>
						<Button className="bg-[#116aef] hover:bg-[#0f5ed8]">
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
