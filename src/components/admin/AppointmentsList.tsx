"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { useRouter } from "next/navigation";

type Appointment = {
	id: string;
	patientName: string;
	patientImage?: string;
	doctorName: string;
	doctorImage?: string;
	time: string;
	type: "Check-up" | "Follow-up" | "Consultation" | "Test Results";
	mode: "in-person" | "virtual";
	status: "scheduled" | "completed" | "cancelled" | "no-show";
};

// Mock data for appointments
const appointments: Appointment[] = [
	{
		id: "1",
		patientName: "John Doe",
		patientImage: "/placeholder.svg?height=40&width=40",
		doctorName: "Dr. Smith",
		doctorImage: "/placeholder.svg?height=40&width=40",
		time: "09:00 AM",
		type: "Check-up",
		mode: "in-person",
		status: "scheduled",
	},
	{
		id: "2",
		patientName: "Jane Smith",
		patientImage: "/placeholder.svg?height=40&width=40",
		doctorName: "Dr. Johnson",
		doctorImage: "/placeholder.svg?height=40&width=40",
		time: "10:30 AM",
		type: "Follow-up",
		mode: "virtual",
		status: "scheduled",
	},
	{
		id: "3",
		patientName: "Bob Brown",
		patientImage: "/placeholder.svg?height=40&width=40",
		doctorName: "Dr. Lee",
		doctorImage: "/placeholder.svg?height=40&width=40",
		time: "11:45 AM",
		type: "Consultation",
		mode: "in-person",
		status: "scheduled",
	},
	{
		id: "4",
		patientName: "Alice Green",
		patientImage: "/placeholder.svg?height=40&width=40",
		doctorName: "Dr. Patel",
		doctorImage: "/placeholder.svg?height=40&width=40",
		time: "02:15 PM",
		type: "Test Results",
		mode: "virtual",
		status: "scheduled",
	},
	{
		id: "5",
		patientName: "Charlie Wilson",
		patientImage: "/placeholder.svg?height=40&width=40",
		doctorName: "Dr. Garcia",
		doctorImage: "/placeholder.svg?height=40&width=40",
		time: "03:30 PM",
		type: "Check-up",
		mode: "in-person",
		status: "scheduled",
	},
];

export function AppointmentsList() {
	const router = useRouter();
	const [filter, setFilter] = useState<string>("all");

	const filteredAppointments =
		filter === "all"
			? appointments
			: appointments.filter((appointment) =>
					filter === "virtual"
						? appointment.mode === "virtual"
						: appointment.mode === "in-person"
			  );

	return (
		<div>
			<div className="flex space-x-2 mb-4">
				<Button
					variant={filter === "all" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("all")}
					className={
						filter === "all" ? "bg-primary text-primary-foreground" : ""
					}
				>
					All
				</Button>
				<Button
					variant={filter === "in-person" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("in-person")}
					className={
						filter === "in-person" ? "bg-primary text-primary-foreground" : ""
					}
				>
					In-Person
				</Button>
				<Button
					variant={filter === "virtual" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("virtual")}
					className={
						filter === "virtual" ? "bg-primary text-primary-foreground" : ""
					}
				>
					Virtual
				</Button>
			</div>

			<ScrollArea className="h-[400px] pr-4">
				<div className="space-y-4">
					{filteredAppointments.map((appointment) => (
						<div
							key={appointment.id}
							className="flex items-start p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow cursor-pointer"
							onClick={() =>
								router.push(`/admin/dashboard/appointments/${appointment.id}`)
							}
						>
							<div className="flex-shrink-0 mr-4">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={appointment.patientImage}
										alt={appointment.patientName}
									/>
									<AvatarFallback>{appointment.patientName[0]}</AvatarFallback>
								</Avatar>
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-start">
									<div>
										<h4 className="text-sm font-medium text-gray-900 truncate">
											{appointment.patientName}
										</h4>
										<p className="text-xs text-gray-500">
											with {appointment.doctorName}
										</p>
									</div>
									<Badge
										variant="outline"
										className={
											appointment.mode === "virtual"
												? "bg-blue-50 text-blue-700 border-blue-200"
												: "bg-green-50 text-green-700 border-green-200"
										}
									>
										{appointment.mode === "virtual" ? "Virtual" : "In-Person"}
									</Badge>
								</div>

								<div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
									<div className="flex items-center">
										<Clock className="mr-1 h-3 w-3" />
										<span>{appointment.time}</span>
									</div>
									<div className="flex items-center">
										<Calendar className="mr-1 h-3 w-3" />
										<span>Today</span>
									</div>
									<div className="flex items-center">
										{appointment.mode === "virtual" ? (
											<Video className="mr-1 h-3 w-3 text-blue-500" />
										) : (
											<MapPin className="mr-1 h-3 w-3 text-green-500" />
										)}
										<span>{appointment.type}</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
