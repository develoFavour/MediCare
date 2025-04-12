"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";

interface MessageDoctorButtonProps {
	doctorId: string;
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| "destructive";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	showIcon?: boolean;
}

export function MessageDoctorButton({
	doctorId,
	variant = "default",
	size = "default",
	className = "",
	showIcon = true,
}: MessageDoctorButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { userData } = useUser();

	const handleMessageDoctor = async () => {
		if (!doctorId) {
			toast.error("Doctor ID is missing");
			return;
		}

		if (!userData?._id) {
			toast.error("You must be logged in to message a doctor");
			return;
		}

		setIsLoading(true);
		try {
			console.log("Starting conversation with doctor:", doctorId);

			// Use fetch with credentials included
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ participantId: doctorId }),
				credentials: "include", // Important: include credentials for auth cookies
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				console.error("Error response:", errorData);
				throw new Error(
					errorData.error || `Failed to start conversation: ${response.status}`
				);
			}

			const conversation = await response.json();
			console.log("Conversation started:", conversation);

			toast.success("Conversation started successfully");

			// Store the conversation ID in localStorage to select it after navigation
			if (conversation._id) {
				localStorage.setItem("selectedConversationId", conversation._id);
			}

			router.push(`/${userData?.role}/dashboard/messages`);
		} catch (error: any) {
			console.error("Error starting conversation:", error);
			toast.error(
				error.message || "Failed to start conversation. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleMessageDoctor}
			variant={variant}
			size={size}
			className={className}
			disabled={isLoading}
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin mr-2" />
			) : showIcon ? (
				<MessageSquare className="h-4 w-4 mr-2" />
			) : null}
			Message
		</Button>
	);
}
