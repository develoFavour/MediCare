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
		setIsLoading(true);
		try {
			const response = await fetch("/api/conversations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ participantId: doctorId }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to start conversation");
			}

			const conversation = await response.json();
			toast.success("Conversation started successfully");
			router.push(`/${userData?.role}/dashboard/messages`);
		} catch (error) {
			console.error("Error starting conversation:", error);
			toast.error("Failed to start conversation. Please try again.");
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
