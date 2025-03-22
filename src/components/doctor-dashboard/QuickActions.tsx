import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CalendarPlus,
	ClipboardList,
	FileText,
	MessageSquare,
	UserPlus,
	Video,
} from "lucide-react";

export default function QuickActions() {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-gray-800">
					Quick Actions
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-3">
					<Button
						variant="outline"
						className="h-auto py-4 px-3 flex flex-col items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600"
					>
						<CalendarPlus className="h-6 w-6 mb-2" />
						<span className="text-sm">New Appointment</span>
					</Button>

					<Button
						variant="outline"
						className="h-auto py-4 px-3 flex flex-col items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600"
					>
						<UserPlus className="h-6 w-6 mb-2" />
						<span className="text-sm">Add Patient</span>
					</Button>

					<Button
						variant="outline"
						className="h-auto py-4 px-3 flex flex-col items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600"
					>
						<Video className="h-6 w-6 mb-2" />
						<span className="text-sm">Start Telehealth</span>
					</Button>

					<Button
						variant="outline"
						className="h-auto py-4 px-3 flex flex-col items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600"
					>
						<FileText className="h-6 w-6 mb-2" />
						<span className="text-sm">Write Prescription</span>
					</Button>

					<Button
						variant="outline"
						className="h-auto py-4 px-3 flex flex-col items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600"
					>
						<ClipboardList className="h-6 w-6 mb-2" />
						<span className="text-sm">Medical Records</span>
					</Button>

					<Button
						variant="outline"
						className="h-auto py-4 px-3 flex flex-col items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600"
					>
						<MessageSquare className="h-6 w-6 mb-2" />
						<span className="text-sm">Message Patient</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
