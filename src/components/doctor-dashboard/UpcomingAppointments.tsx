"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	format,
	isToday,
	isTomorrow,
	addDays,
	isAfter,
	isBefore,
} from "date-fns";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface UpcomingAppointmentsProps {
	appointments?: any[];
}

export default function UpcomingAppointments({
	appointments = [],
}: UpcomingAppointmentsProps) {
	const router = useRouter();
	const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
	const [filter, setFilter] = useState<"today" | "tomorrow" | "week" | "all">(
		"today"
	);

	useEffect(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = addDays(today, 1);
		const nextWeek = addDays(today, 7);

		let filtered = appointments.filter((apt) => {
			const aptDate = new Date(apt.date);
			return apt.status === "scheduled" && !isBefore(aptDate, today);
		});

		// Apply time filter
		if (filter === "today") {
			filtered = filtered.filter((apt) => isToday(new Date(apt.date)));
		} else if (filter === "tomorrow") {
			filtered = filtered.filter((apt) => isTomorrow(new Date(apt.date)));
		} else if (filter === "week") {
			filtered = filtered.filter((apt) => {
				const aptDate = new Date(apt.date);
				return isAfter(aptDate, today) && isBefore(aptDate, nextWeek);
			});
		}

		// Sort by date (earliest first)
		filtered.sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		setUpcomingAppointments(filtered);
	}, [appointments, filter]);

	const handleStartAppointment = (appointmentId: string) => {
		router.push(`/doctor/appointments/${appointmentId}`);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle>Upcoming Appointments</CardTitle>
				<div className="flex gap-1">
					<Button
						variant={filter === "today" ? "default" : "outline"}
						size="sm"
						onClick={() => setFilter("today")}
					>
						Today
					</Button>
					<Button
						variant={filter === "tomorrow" ? "default" : "outline"}
						size="sm"
						onClick={() => setFilter("tomorrow")}
					>
						Tomorrow
					</Button>
					<Button
						variant={filter === "week" ? "default" : "outline"}
						size="sm"
						onClick={() => setFilter("week")}
					>
						This Week
					</Button>
					<Button
						variant={filter === "all" ? "default" : "outline"}
						size="sm"
						onClick={() => setFilter("all")}
					>
						All
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{upcomingAppointments.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						No upcoming appointments {filter !== "all" ? `for ${filter}` : ""}
					</div>
				) : (
					<ScrollArea className="h-[400px] pr-4">
						<div className="space-y-4">
							{upcomingAppointments.map((appointment) => (
								<div
									key={appointment._id}
									className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={
													appointment.userId?.profileImage || "/placeholder.svg"
												}
												alt={appointment.userId?.fullName}
											/>
											<AvatarFallback>
												{appointment.userId?.fullName
													?.split(" ")
													.map((n: string) => n[0])
													.join("")
													.toUpperCase() || "P"}
											</AvatarFallback>
										</Avatar>
										<div>
											<h4 className="font-medium">
												{appointment.userId?.fullName || "Patient"}
											</h4>
											<div className="flex items-center text-sm text-gray-500 mt-1">
												<Calendar className="mr-1 h-3 w-3" />
												{format(new Date(appointment.date), "MMM d, yyyy")}
												<Clock className="ml-2 mr-1 h-3 w-3" />
												{format(new Date(appointment.date), "h:mm a")}
											</div>
											<div className="flex items-center text-sm text-gray-500 mt-1">
												{appointment.type === "virtual" ? (
													<>
														<Video className="mr-1 h-3 w-3" /> Virtual
														Appointment
													</>
												) : (
													<>
														<MapPin className="mr-1 h-3 w-3" /> In-person Visit
													</>
												)}
											</div>
										</div>
									</div>
									<div className="flex flex-col sm:flex-row items-center gap-2 self-end sm:self-center">
										<Badge
											variant={
												isToday(new Date(appointment.date))
													? "default"
													: "secondary"
											}
										>
											{isToday(new Date(appointment.date))
												? "Today"
												: isTomorrow(new Date(appointment.date))
												? "Tomorrow"
												: format(new Date(appointment.date), "MMM d")}
										</Badge>
										<Button
											size="sm"
											onClick={() => handleStartAppointment(appointment._id)}
										>
											{isToday(new Date(appointment.date)) ? "Start" : "View"}
										</Button>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
