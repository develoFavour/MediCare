import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface Appointment {
	id: string;
	doctor: string;
	specialty: string;
	date: string;
	time: string;
}

export function UpcomingAppointments({
	appointments,
}: {
	appointments: Appointment[];
}) {
	return (
		<Card className="bg-white shadow-md">
			<CardHeader className="bg-[#116aef] text-white">
				<CardTitle className="text-lg font-semibold">
					Upcoming Appointments
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				{appointments.map((appointment) => (
					<div
						key={appointment.id}
						className="mb-4 last:mb-0 p-3 bg-[#e9f2ff] rounded-lg"
					>
						<div className="flex justify-between items-center mb-2">
							<h3 className="font-medium text-[#116aef]">
								{appointment.doctor}
							</h3>
							<Badge
								variant="outline"
								className="bg-white text-[#116aef] border-[#116aef]"
							>
								{appointment.specialty}
							</Badge>
						</div>
						<div className="flex items-center text-sm text-gray-600">
							<Calendar className="w-4 h-4 mr-2 text-[#116aef]" />
							{appointment.date}
						</div>
						<div className="flex items-center text-sm text-gray-600 mt-1">
							<Clock className="w-4 h-4 mr-2 text-[#116aef]" />
							{appointment.time}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
