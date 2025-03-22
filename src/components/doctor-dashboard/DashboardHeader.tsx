"use client";

import { Bell, Calendar, Search, Settings } from "lucide-react";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DashboardHeaderProps {
	userData: any;
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
	const router = useRouter();
	const currentDate = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

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
		<div className="flex flex-col space-y-4 ml-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
			<div>
				<h1 className="text-2xl font-bold text-gray-800">
					Welcome, Dr. {userData?.fullName?.split(" ")[1]}
				</h1>
				<p className="text-gray-500 flex items-center mt-1">
					<Calendar className="h-4 w-4 mr-2" />
					{currentDate}
				</p>
			</div>

			<div className="flex items-center space-x-4">
				<div className="relative hidden md:block">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search patients, appointments..."
						className="pl-10 w-64 bg-white border-gray-200"
					/>
				</div>

				<div className="relative">
					<Button variant="outline" size="icon" className="relative">
						<Bell className="h-5 w-5 text-gray-600" />
						<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							3
						</span>
					</Button>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<Settings className="h-5 w-5 text-gray-600" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => router.push("/doctor/dashboard/settings")}
						>
							Profile Settings
						</DropdownMenuItem>
						<DropdownMenuItem>Notifications</DropdownMenuItem>
						<DropdownMenuItem>Help & Support</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout} className="text-red-600">
							Log Out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
