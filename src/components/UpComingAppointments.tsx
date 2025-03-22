import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Appointment = {
	id: string;
	patientName: string;
	doctorName: string;
	time: string;
	type: string;
};

const appointments: Appointment[] = [
	{
		id: "1",
		patientName: "John Doe",
		doctorName: "Dr. Smith",
		time: "09:00 AM",
		type: "Check-up",
	},
	{
		id: "2",
		patientName: "Jane Smith",
		doctorName: "Dr. Johnson",
		time: "10:30 AM",
		type: "Follow-up",
	},
	{
		id: "3",
		patientName: "Bob Brown",
		doctorName: "Dr. Lee",
		time: "11:45 AM",
		type: "Consultation",
	},
	{
		id: "4",
		patientName: "Alice Green",
		doctorName: "Dr. Patel",
		time: "02:15 PM",
		type: "Test Results",
	},
	{
		id: "5",
		patientName: "Charlie Wilson",
		doctorName: "Dr. Garcia",
		time: "03:30 PM",
		type: "Check-up",
	},
];

export default function UpcomingAppointments() {
	return (
		<Card className="w-full bg-[#F8FAFC] border-[#E3F2FD]">
			<CardHeader>
				<CardTitle className="text-[#1565C0]">Upcoming Appointments</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px] pr-4">
					{appointments.map((appointment) => (
						<div
							key={appointment.id}
							className="mb-4 grid grid-cols-[1fr_2fr] gap-4 rounded-lg border mt-4 p-4 border-[#1565C0]"
						>
							<div className="flex flex-col">
								<span className="text-sm font-medium">{appointment.time}</span>
								<Badge
									variant="outline"
									className="mt-1 w-fit bg-[#E3F2FD] text-[#1565C0]"
								>
									{appointment.type}
								</Badge>
							</div>
							<div>
								<h4 className="text-sm font-semibold">
									{appointment.patientName}
								</h4>
								<p className="text-sm text-muted-foreground">
									{appointment.doctorName}
								</p>
							</div>
						</div>
					))}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
