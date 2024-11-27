"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { useUser } from "@/app/context/UserContext";

interface UserData {
	fullName: string;
	email: string;
	// avatarUrl?: string;
}

export function ProfileSection() {
	const { userData, error } = useUser();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/users/logout");
			const data = await response.json();

			if (data.success) {
				toast.success("Logged out successfully");
				router.push("/login");
			} else {
				toast.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("An error occurred during logout");
		}
	};

	return (
		<div className="mt-auto border-t border-gray-200/10 p-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="w-full justify-start px-2">
						<div className="flex flex-col items-start">
							<span className="text-sm font-medium">{userData?.fullName}</span>
							<span className="text-xs text-muted-foreground">
								{userData?.email}
							</span>
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuItem asChild>
						<Link href="/patient/profile" className="flex items-center">
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/patient/settings" className="flex items-center">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-red-600 focus:text-red-600 cursor-pointer"
						onClick={handleLogout}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
