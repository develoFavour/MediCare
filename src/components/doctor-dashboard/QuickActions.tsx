"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, MessageSquare, Users, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
	const router = useRouter();

	const actions = [
		{
			name: "Schedule Appointment",
			icon: Calendar,
			color: "text-blue-500",
			onClick: () => router.push("/doctor/appointments/schedule"),
		},
		{
			name: "Create Medical Record",
			icon: FileText,
			color: "text-green-500",
			onClick: () => router.push("/doctor/records/create"),
		},
		{
			name: "Message Patient",
			icon: MessageSquare,
			color: "text-purple-500",
			onClick: () => router.push("/messages"),
		},
		{
			name: "View Patient List",
			icon: Users,
			color: "text-amber-500",
			onClick: () => router.push("/doctor/patients"),
		},
		{
			name: "Set Availability",
			icon: Clock,
			color: "text-red-500",
			onClick: () => router.push("/doctor/availability"),
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-2">
					{actions.map((action) => {
						const Icon = action.icon;

						return (
							<Button
								key={action.name}
								variant="outline"
								className="justify-start h-auto py-3"
								onClick={action.onClick}
							>
								<Icon className={`mr-2 h-4 w-4 ${action.color}`} />
								{action.name}
							</Button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
