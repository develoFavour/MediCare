import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Reminder {
	id: string;
	title: string;
	description: string;
	completed: boolean;
}

export function HealthReminders({ reminders }: { reminders: Reminder[] }) {
	return (
		<Card className="bg-white shadow-md">
			<CardHeader className="bg-[#116aef] text-white">
				<CardTitle className="text-lg font-semibold">
					Health Reminders
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				{reminders.map((reminder) => (
					<div key={reminder.id} className="flex items-start mb-4 last:mb-0">
						{reminder.completed ? (
							<CheckCircle className="w-6 h-6 mr-3 text-green-500 flex-shrink-0" />
						) : (
							<AlertCircle className="w-6 h-6 mr-3 text-yellow-500 flex-shrink-0" />
						)}
						<div>
							<h3
								className={`font-medium ${
									reminder.completed ? "text-green-700" : "text-[#116aef]"
								}`}
							>
								{reminder.title}
							</h3>
							<p className="text-sm text-gray-600">{reminder.description}</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
