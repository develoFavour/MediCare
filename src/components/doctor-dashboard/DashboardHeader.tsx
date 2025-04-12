import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, MessageSquare, Settings } from "lucide-react";

interface DashboardHeaderProps {
	userData: any;
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
	return (
		<Card className="border-none shadow-sm">
			<CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
				<div className="flex items-center gap-4">
					<Avatar className="h-12 w-12">
						<AvatarImage
							src={userData?.profileImage || "/placeholder.svg"}
							alt={userData?.fullName}
						/>
						<AvatarFallback>
							{userData?.fullName
								?.split(" ")
								.map((n: string) => n[0])
								.join("")
								.toUpperCase() || "D"}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="text-xl font-bold">
							Welcome, Dr. {userData?.fullName?.split(" ")[0] || "Doctor"}
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 mt-4 sm:mt-0">
					<Button variant="outline" size="icon">
						<Bell className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon">
						<MessageSquare className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon">
						<Calendar className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon">
						<Settings className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
