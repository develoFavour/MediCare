import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	CalendarClock,
	FileCheck,
	MessageSquare,
	Pill,
	User,
} from "lucide-react";

// Mock data for recent activities
const activities = [
	{
		id: 1,
		type: "appointment",
		description: "Completed appointment with Sarah Johnson",
		time: "2 hours ago",
		icon: CalendarClock,
	},
	{
		id: 2,
		type: "prescription",
		description: "Issued prescription for Michael Brown",
		time: "3 hours ago",
		icon: Pill,
	},
	{
		id: 3,
		type: "message",
		description: "Sent follow-up message to Emily Davis",
		time: "5 hours ago",
		icon: MessageSquare,
	},
	{
		id: 4,
		type: "record",
		description: "Updated medical records for James Wilson",
		time: "Yesterday",
		icon: FileCheck,
	},
	{
		id: 5,
		type: "patient",
		description: "New patient registered: Robert Martinez",
		time: "Yesterday",
		icon: User,
	},
];

export default function RecentActivities() {
	const getActivityColor = (type: string) => {
		switch (type) {
			case "appointment":
				return "bg-blue-100 text-blue-600";
			case "prescription":
				return "bg-green-100 text-green-600";
			case "message":
				return "bg-purple-100 text-purple-600";
			case "record":
				return "bg-amber-100 text-amber-600";
			case "patient":
				return "bg-indigo-100 text-indigo-600";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-gray-800">
					Recent Activities
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{activities.map((activity) => {
						const IconComponent = activity.icon;
						const colorClass = getActivityColor(activity.type);

						return (
							<div key={activity.id} className="flex items-start">
								<div className={`rounded-full p-2 mr-3 ${colorClass}`}>
									<IconComponent className="h-5 w-5" />
								</div>
								<div className="flex-1">
									<p className="text-sm text-gray-800">
										{activity.description}
									</p>
									<p className="text-xs text-gray-500 mt-1">{activity.time}</p>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
