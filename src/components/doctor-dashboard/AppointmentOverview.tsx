import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
	const completionPercentage =
		appointmentsToday > 0
			? Math.round((completedAppointments / appointmentsToday) * 100)
			: 0;

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg font-semibold text-gray-800">
					Today&apos;s Appointments
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="flex items-center p-4 bg-blue-50 rounded-lg">
						<div className="rounded-full bg-blue-100 p-3 mr-4">
							<Users className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Total Appointments</p>
							<h3 className="text-2xl font-bold text-gray-800">
								{appointmentsToday}
							</h3>
						</div>
					</div>

					<div className="flex items-center p-4 bg-green-50 rounded-lg">
						<div className="rounded-full bg-green-100 p-3 mr-4">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Completed</p>
							<h3 className="text-2xl font-bold text-gray-800">
								{completedAppointments}
							</h3>
						</div>
					</div>

					<div className="flex items-center p-4 bg-amber-50 rounded-lg">
						<div className="rounded-full bg-amber-100 p-3 mr-4">
							<Clock className="h-6 w-6 text-amber-600" />
						</div>
						<div>
							<p className="text-sm text-gray-500">Pending</p>
							<h3 className="text-2xl font-bold text-gray-800">
								{pendingAppointments}
							</h3>
						</div>
					</div>
				</div>

				<div className="mt-6">
					<div className="flex justify-between mb-2">
						<span className="text-sm text-gray-500">Completion Rate</span>
						<span className="text-sm font-medium text-gray-700">
							{completionPercentage}%
						</span>
					</div>
					<Progress value={completionPercentage} className="h-2" />
				</div>
			</CardContent>
		</Card>
	);
}
