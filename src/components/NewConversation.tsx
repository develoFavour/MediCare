"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2, MessageSquare } from "lucide-react";
import { useMessages } from "@/app/context/MessageContext";
import { useRouter } from "next/navigation";

interface User {
	_id: string;
	fullName: string;
	email: string;
	role: string;
	profileImage?: string;
}

export function NewConversation() {
	const router = useRouter();
	const { startConversation } = useMessages();
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isStarting, setIsStarting] = useState(false);
	const [open, setOpen] = useState(false);

	const handleSearch = async () => {
		if (!searchTerm.trim()) return;

		setIsSearching(true);
		try {
			const response = await fetch(
				`/api/users/search?q=${encodeURIComponent(searchTerm)}`
			);

			if (!response.ok) {
				throw new Error("Failed to search users");
			}

			const data = await response.json();
			setSearchResults(data);
		} catch (error) {
			console.error("Error searching users:", error);
		} finally {
			setIsSearching(false);
		}
	};

	const handleStartConversation = async (userId: string) => {
		setIsStarting(true);
		try {
			const conversation = await startConversation(userId);
			if (conversation) {
				setOpen(false);
				router.push("/messages");
			}
		} finally {
			setIsStarting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-[#116aef] hover:bg-[#0f5ed8]">
					<MessageSquare className="mr-2 h-4 w-4" />
					New Message
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New Conversation</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="flex items-center gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search for a user..."
								className="pl-10"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							/>
						</div>
						<Button
							onClick={handleSearch}
							disabled={isSearching || !searchTerm.trim()}
						>
							{isSearching ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Search"
							)}
						</Button>
					</div>

					<div className="max-h-[300px] overflow-y-auto">
						{isSearching ? (
							<div className="flex justify-center py-8">
								<Loader2 className="h-8 w-8 text-primary animate-spin" />
							</div>
						) : searchResults.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								{searchTerm
									? "No users found"
									: "Search for users to start a conversation"}
							</div>
						) : (
							<div className="space-y-2">
								{searchResults.map((user) => (
									<div
										key={user._id}
										className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
									>
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												<AvatarImage
													src={
														user.profileImage ||
														"/placeholder.svg?height=40&width=40"
													}
													alt={user.fullName}
												/>
												<AvatarFallback>
													{user.fullName.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<h3 className="font-medium text-gray-900">
													{user.fullName}
												</h3>
												<p className="text-sm text-gray-500">{user.role}</p>
											</div>
										</div>
										<Button
											size="sm"
											onClick={() => handleStartConversation(user._id)}
											disabled={isStarting}
										>
											{isStarting ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												"Message"
											)}
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
