"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Calendar,
	Clock,
	ArrowRight,
	MapPin,
	Video,
	Phone,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { format, isPast, isToday, addDays } from "date-fns";

interface Appointment {
	_id: string;
	doctorId: {
		email: string;
		fullName: string;
		profileImage: string;
		_id: string;
		specialty: string;
	};
	date: string;
	time: string;
	status: string;
	type: "in-person" | "virtual" | "phone";
	location?: string;
	notes?: string;
}

interface UpcomingAppointmentsProps {
	limit?: number;
}

export function UpcomingAppointments({ limit }: UpcomingAppointmentsProps) {
	const { userData } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get(
					`/api/appointments?userId=${userData?._id}`
				);
				setAppointments(response.data.appointments);
				console.log(response.data.appointments);
			} catch (err) {
				console.error("Error fetching upcoming appointments:", err);
				setError("Failed to load appointments");
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [limit]);

	const getAppointmentTypeIcon = (type: string) => {
		switch (type) {
			case "virtual":
				return <Video className="h-4 w-4 text-blue-600" />;
			case "phone":
				return <Phone className="h-4 w-4 text-green-600" />;
			default:
				return <MapPin className="h-4 w-4 text-amber-600" />;
		}
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold flex items-center">
						<Calendar className="h-5 w-5 mr-2 text-primary" />
						Upcoming Appointments
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						className="text-primary"
						onClick={() => router.push("/patient/appointments")}
					>
						View All <ArrowRight className="ml-1 h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{[1, 2].map((i) => (
							<div key={i} className="flex flex-col space-y-2">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center text-red-500 py-4">
						{error}. Please try refreshing the page.
					</div>
				) : appointments.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<p className="mb-4">No upcoming appointments found.</p>
						<Button
							variant="outline"
							onClick={() => router.push("patient/dashboard/appointment")}
						>
							Book New Appointment
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{appointments.map((appointment) => (
							<div key={appointment?._id} className="p-3 bg-gray-50 rounded-lg">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-medium text-gray-900">
											{appointment?.doctorId?.fullName}
										</h3>
										<Badge
											variant="outline"
											className="mt-1 bg-primary/10 text-primary border-primary/20"
										>
											{appointment?.doctorId?.specialty}
										</Badge>
									</div>
									<div className="flex items-center gap-1">
										<Badge
											variant={
												appointment.status === "confirmed"
													? "default"
													: "outline"
											}
										>
											{appointment.status === "confirmed"
												? "Confirmed"
												: "Pending"}
										</Badge>
										<Badge
											variant="outline"
											className="flex items-center gap-1 bg-gray-50"
										>
											{getAppointmentTypeIcon(appointment?.type)}
											<span className="capitalize xs:inline">
												{appointment?.type}
											</span>
										</Badge>
									</div>
								</div>
								<div className="mt-2 space-y-1">
									<div className="flex items-center text-sm text-gray-600">
										<Calendar className="w-4 h-4 mr-2 text-primary" />
										{new Date(appointment?.date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</div>
									<div className="flex items-center text-sm text-gray-600">
										<Clock className="w-4 h-4 mr-2 text-primary" />
										{format(new Date(appointment.date), "h:mm a")}
									</div>
								</div>
								<div className="mt-3 flex justify-end gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() =>
											router.push(
												`/patient/dashboard/upcoming-appointments/${appointment?._id}`
											)
										}
									>
										Details
									</Button>
								</div>
							</div>
						))}
						<Button
							variant="outline"
							className="w-full"
							onClick={() => router.push("/patient/dashboard/appointment")}
						>
							Book New Appointment
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
