"use client";

import { useState } from "react";
import { Bell, MessageSquare, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface AdminHeaderProps {
	user: {
		fullName: string;
		email: string;
		profileImage?: string;
		role: string;
	};
}

export function AdminHeader({ user }: AdminHeaderProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	const handleLogout = async () => {
		try {
			toast.loading("Logging out...");
			const response = await fetch("/api/users/logout", {
				method: "GET",
				credentials: "include",
			});

			if (response.ok) {
				toast.dismiss();
				toast.success("Logged out successfully");
				window.location.href = "/login";
			} else {
				toast.dismiss();
				toast.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.dismiss();
			toast.error("An error occurred during logout");
		}
	};

	const getUserInitials = () => {
		if (!user?.fullName) return "";
		const names = user.fullName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return user.fullName.substring(0, 2).toUpperCase();
	};

	const checkTimeOfDay = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	return (
		<header className="z-30 flex h-24 items-center gap-4 border-b bg-white px-6">
			<div className="hidden md:block">
				<h1 className="text-2xl text-gray-800 font-semibold">
					{checkTimeOfDay()}, {user.fullName}
				</h1>
				<p className="text-sm text-muted-foreground">
					Welcome to your admin dashboard
				</p>
			</div>

			<div className="ml-auto flex items-center gap-4">
				<form className="hidden md:block">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search..."
							className="w-64 pl-8 bg-background"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</form>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" size="icon" className="relative">
							<Bell className="h-5 w-5" />
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
								3
							</span>
							<span className="sr-only">Notifications</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80 p-0" align="end">
						<div className="border-b px-4 py-3">
							<h3 className="text-sm font-medium">Notifications</h3>
						</div>
						<div className="divide-y">
							<NotificationItem
								title="New appointment request"
								description="Sarah Johnson requested an appointment with Dr. Williams"
								time="5 minutes ago"
							/>
							<NotificationItem
								title="Appointment cancelled"
								description="Michael Brown cancelled his appointment for today"
								time="1 hour ago"
							/>
							<NotificationItem
								title="New doctor registration"
								description="Dr. Emily Chen completed her registration"
								time="3 hours ago"
							/>
						</div>
						<div className="border-t p-2 text-center">
							<Button variant="ghost" className="w-full text-xs text-primary">
								View all notifications
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" size="icon" className="relative">
							<MessageSquare className="h-5 w-5" />
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
								2
							</span>
							<span className="sr-only">Messages</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80 p-0" align="end">
						<div className="border-b px-4 py-3">
							<h3 className="text-sm font-medium">Messages</h3>
						</div>
						<div className="divide-y">
							<MessageItem
								name="Dr. Williams"
								message="Can you review the new patient files?"
								time="10 minutes ago"
								avatar="/placeholder.svg?height=32&width=32"
							/>
							<MessageItem
								name="Nurse Johnson"
								message="Room 302 needs assistance"
								time="30 minutes ago"
								avatar="/placeholder.svg?height=32&width=32"
							/>
						</div>
						<div className="border-t p-2 text-center">
							<Button variant="ghost" className="w-full text-xs text-primary">
								View all messages
							</Button>
						</div>
					</PopoverContent>
				</Popover>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-8 w-8 rounded-full">
							<Avatar className="h-8 w-8">
								<AvatarImage src={user.profileImage} alt={user.fullName} />
								<AvatarFallback>{getUserInitials()}</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end" forceMount>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									{user.fullName}
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{user.email}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => router.push("/admin/dashboard/profile")}
						>
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => router.push("/admin/dashboard/settings")}
						>
							Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-red-600 focus:text-red-600"
							onClick={handleLogout}
						>
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

interface NotificationItemProps {
	title: string;
	description: string;
	time: string;
}

function NotificationItem({ title, description, time }: NotificationItemProps) {
	return (
		<div className="flex items-start gap-4 p-4 hover:bg-muted/50">
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium">{title}</p>
				<p className="text-xs text-muted-foreground">{description}</p>
				<p className="text-xs text-muted-foreground">{time}</p>
			</div>
		</div>
	);
}

interface MessageItemProps {
	name: string;
	message: string;
	time: string;
	avatar: string;
}

function MessageItem({ name, message, time, avatar }: MessageItemProps) {
	return (
		<div className="flex items-start gap-4 p-4 hover:bg-muted/50">
			<Avatar className="h-8 w-8">
				<AvatarImage src={avatar} alt={name} />
				<AvatarFallback>{name[0]}</AvatarFallback>
			</Avatar>
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium">{name}</p>
				<p className="text-xs text-muted-foreground">{message}</p>
				<p className="text-xs text-muted-foreground">{time}</p>
			</div>
		</div>
	);
}
