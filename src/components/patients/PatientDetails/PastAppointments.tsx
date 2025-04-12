import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/ui/empty-state";

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
}

interface Appointment {
	_id: string;
	doctorId: Doctor | null;
	date: string;
	reason: string;
	status: "scheduled" | "canceled";
}

interface PastAppointmentsProps {
	appointments: Appointment[];
}

export function PastAppointments({ appointments }: PastAppointmentsProps) {
	if (appointments.length === 0) {
		return (
			<EmptyState
				icon={<Clock className="h-12 w-12 text-muted-foreground" />}
				title="No Past Appointments"
				description="There are no completed or canceled appointments in the history."
			/>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle>Past Appointments</CardTitle>
				<CardDescription>Completed or canceled appointments</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date & Time</TableHead>
							<TableHead>Doctor</TableHead>
							<TableHead>Reason</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{appointments.map((appointment) => (
							<TableRow key={appointment._id}>
								<TableCell>
									<div className="flex flex-col">
										<div className="flex items-center font-medium">
											<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
											{format(new Date(appointment.date), "MMM d, yyyy")}
										</div>
										<div className="flex items-center text-sm text-muted-foreground mt-1">
											<Clock className="h-3 w-3 mr-2" />
											{format(new Date(appointment.date), "h:mm a")}
										</div>
									</div>
								</TableCell>
								<TableCell>
									{appointment.doctorId ? (
										<div className="flex flex-col">
											<div className="font-medium">
												Dr. {appointment.doctorId.fullName}
											</div>
											<div className="text-sm text-muted-foreground">
												{appointment.doctorId.specialty}
											</div>
										</div>
									) : (
										<span className="text-muted-foreground">
											Doctor information not available
										</span>
									)}
								</TableCell>
								<TableCell>
									<div className="flex items-start">
										<FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
										<span>{appointment.reason}</span>
									</div>
								</TableCell>
								<TableCell>
									{appointment.status === "canceled" ? (
										<Badge
											variant="outline"
											className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800"
										>
											Canceled
										</Badge>
									) : (
										<Badge
											variant="outline"
											className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
										>
											Completed
										</Badge>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
