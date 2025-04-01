"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { useMessages } from "@/app/context/MessageContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface StartConversationButtonProps extends ButtonProps {
	userId: string;
	userName: string;
	userRole: string;
}

export function StartConversationButton({
	userId,
	userRole,
	userName,
	className,
	...props
}: StartConversationButtonProps) {
	const router = useRouter();
	const { startConversation } = useMessages();
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (!userId) {
			toast.error("User ID is required to start a conversation");
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ participantId: userId }),
			});

			// Check if response is OK before trying to parse JSON
			if (!response.ok) {
				const errorText = await response.text();
				console.error("Error response:", errorText);
				throw new Error(
					`Failed to start conversation: ${response.status} ${response.statusText}`
				);
			}

			const conversation = await response.json();

			if (conversation) {
				router.push(`/${userRole}/dashboard/messages/`);
			} else {
				toast.error("Failed to start conversation");
			}
		} catch (error: any) {
			console.error("Error starting conversation:", error);
			toast.error(error.message || "Failed to start conversation");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleClick}
			disabled={isLoading}
			className={className}
			{...props}
		>
			{isLoading ? (
				<>
					<Loader2 className="h-4 w-4 mr-2 animate-spin" />
					Loading...
				</>
			) : (
				<>
					<MessageSquare className="h-4 w-4 mr-2" />
					Message {userName}
				</>
			)}
		</Button>
	);
}
