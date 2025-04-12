import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Calendar,
	MessageSquare,
	FileText,
	CheckCircle,
	Clock,
} from "lucide-react";

export default function RecentActivities() {
	// This would typically come from an API
	const activities = [
		{
			id: 1,
			type: "appointment_completed",
			patient: {
				name: "Sarah Johnson",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			time: "2 hours ago",
			description: "Completed appointment with Sarah Johnson",
			icon: CheckCircle,
			iconColor: "text-green-500",
		},
		{
			id: 2,
			type: "message_received",
			patient: {
				name: "Michael Chen",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			time: "3 hours ago",
			description: "New message from Michael Chen",
			icon: MessageSquare,
			iconColor: "text-blue-500",
		},
		{
			id: 3,
			type: "appointment_scheduled",
			patient: {
				name: "Emma Wilson",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			time: "5 hours ago",
			description: "New appointment scheduled with Emma Wilson",
			icon: Calendar,
			iconColor: "text-purple-500",
		},
		{
			id: 4,
			type: "medical_record_updated",
			patient: {
				name: "James Rodriguez",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			time: "Yesterday",
			description: "Updated medical records for James Rodriguez",
			icon: FileText,
			iconColor: "text-amber-500",
		},
		{
			id: 5,
			type: "appointment_reminder",
			patient: {
				name: "Olivia Parker",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			time: "Yesterday",
			description: "Upcoming appointment reminder with Olivia Parker",
			icon: Clock,
			iconColor: "text-red-500",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Activities</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[300px] pr-4">
					<div className="space-y-4">
						{activities.map((activity) => {
							const Icon = activity.icon;

							return (
								<div key={activity.id} className="flex items-start gap-4">
									<div
										className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${activity.iconColor}`}
									>
										<Icon className="h-4 w-4" />
									</div>
									<div className="flex-1 space-y-1">
										<div className="flex items-center justify-between">
											<p className="font-medium">{activity.description}</p>
											<span className="text-xs text-gray-500">
												{activity.time}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Avatar className="h-6 w-6">
												<AvatarImage
													src={activity.patient.avatar || "/placeholder.svg"}
													alt={activity.patient.name}
												/>
												<AvatarFallback>
													{activity.patient.name
														.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm text-gray-500">
												{activity.patient.name}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
