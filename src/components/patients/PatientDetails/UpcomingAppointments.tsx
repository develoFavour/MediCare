"use client";

import { Button } from "@/components/ui/button";
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
import { CalendarX2, Calendar, Clock, FileText } from "lucide-react";
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

interface UpcomingAppointmentsProps {
	appointments: Appointment[];
	onCancelAppointment: (appointmentId: string) => void;
}

export function UpcomingAppointments({
	appointments,
	onCancelAppointment,
}: UpcomingAppointmentsProps) {
	if (appointments.length === 0) {
		return (
			<EmptyState
				icon={<CalendarX2 className="h-12 w-12 text-muted-foreground" />}
				title="No Upcoming Appointments"
				description="This patient has no scheduled future appointments."
			/>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle>Upcoming Appointments</CardTitle>
				<CardDescription>
					Scheduled appointments that have not yet occurred
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date & Time</TableHead>
							<TableHead>Doctor</TableHead>
							<TableHead>Reason</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{appointments.map((appointment) => (
							<TableRow key={appointment._id}>
								<TableCell>
									<div className="flex flex-col">
										<div className="flex items-center font-medium">
											<Calendar className="h-4 w-4 mr-2 text-primary" />
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
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
									>
										Scheduled
									</Badge>
								</TableCell>
								<TableCell>
									<Button
										onClick={() => onCancelAppointment(appointment._id)}
										variant="destructive"
										size="sm"
									>
										Cancel
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
