"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User } from "lucide-react";

interface AppointmentCalendarProps {
	appointments: any[];
}

export default function AppointmentCalendar({
	appointments,
}: AppointmentCalendarProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date()
	);

	// Get appointments for the selected date
	const appointmentsForSelectedDate = selectedDate
		? appointments.filter((apt) => isSameDay(new Date(apt.date), selectedDate))
		: [];

	// Get dates with appointments for highlighting in the calendar
	const appointmentDates = appointments.map((apt) => new Date(apt.date));

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card className="md:col-span-1">
				<CardHeader>
					<CardTitle>Appointment Calendar</CardTitle>
				</CardHeader>
				<CardContent>
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={setSelectedDate}
						className="rounded-md border"
						modifiers={{
							appointment: appointmentDates,
						}}
						modifiersStyles={{
							appointment: {
								fontWeight: "bold",
								backgroundColor: "rgba(59, 130, 246, 0.1)",
								borderRadius: "100%",
							},
						}}
					/>
				</CardContent>
			</Card>

			<Card className="md:col-span-2">
				<CardHeader>
					<CardTitle>
						{selectedDate
							? format(selectedDate, "MMMM d, yyyy")
							: "Select a date"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{appointmentsForSelectedDate.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No appointments scheduled for this date
						</div>
					) : (
						<ScrollArea className="h-[400px] pr-4">
							<div className="space-y-4">
								{appointmentsForSelectedDate.map((appointment, index) => (
									<div
										key={appointment._id || index}
										className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
									>
										<div className="flex items-start gap-3">
											<div
												className={`w-2 h-full min-h-[40px] rounded-full ${
													appointment.status === "completed"
														? "bg-green-500"
														: appointment.status === "cancelled"
														? "bg-red-500"
														: "bg-blue-500"
												}`}
											/>
											<div>
												<h4 className="font-medium">
													{appointment.userId?.fullName || "Patient"}
												</h4>
												<div className="flex items-center text-sm text-gray-500 mt-1">
													<Clock className="mr-1 h-3 w-3" />
													{format(new Date(appointment.date), "h:mm a")}
												</div>
												<div className="flex items-center text-sm text-gray-500 mt-1">
													<User className="mr-1 h-3 w-3" />
													{appointment.type || "In-person"}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2 self-end sm:self-center">
											<Badge
												variant={
													appointment.status === "completed"
														? "secondary"
														: appointment.status === "cancelled"
														? "destructive"
														: "default"
												}
											>
												{appointment.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
