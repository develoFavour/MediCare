import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface AppointmentsOverviewProps {
	appointmentsToday: number;
	completedAppointments: number;
	pendingAppointments: number;
}

export default function AppointmentsOverview({
	appointmentsToday,
	completedAppointments,
	pendingAppointments,
}: AppointmentsOverviewProps) {
	// Calculate completion percentage
	const completionPercentage =
		appointmentsToday > 0
			? Math.round((completedAppointments / appointmentsToday) * 100)
			: 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Appointments Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="flex items-center gap-2">
							<Clock className="h-5 w-5 text-blue-500" />
							<div>
								<p className="text-sm text-gray-500">
									Today&apos;s Appointments
								</p>
								<p className="text-2xl font-bold">{appointmentsToday}</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<div>
								<p className="text-sm text-gray-500">Completed</p>
								<p className="text-2xl font-bold">{completedAppointments}</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-amber-500" />
							<div>
								<p className="text-sm text-gray-500">Pending</p>
								<p className="text-2xl font-bold">{pendingAppointments}</p>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Progress</span>
							<span>{completionPercentage}%</span>
						</div>
						<Progress value={completionPercentage} className="h-2" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
