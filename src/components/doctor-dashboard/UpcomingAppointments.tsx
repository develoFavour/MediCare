"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	Clock,
	MoreHorizontal,
	Video,
	MapPin,
	Phone,
	Loader2,
	AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

interface Appointment {
	_id: string;
	userId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
	};
	date: string;
	reason: string;
	type: "in-person" | "virtual" | "phone";
	notes: string;
	status: "scheduled" | "completed" | "cancelled" | "no-show";
}

export default function UpcomingAppointments() {
	const { userData } = useUser();
	const router = useRouter();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAppointments = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(
				`/api/appointments?doctorId=${userData?._id}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch appointments");
			}

			const data = await response.json();

			// Filter for upcoming appointments and sort by date
			const now = new Date();
			const upcomingAppointments = data.appointments
				.filter(
					(apt: Appointment) =>
						new Date(apt.date) > now && apt.status === "scheduled"
				)
				.sort(
					(a: Appointment, b: Appointment) =>
						new Date(a.date).getTime() - new Date(b.date).getTime()
				)
				.slice(0, 3); // Limit to 3 most recent

			setAppointments(upcomingAppointments);
		} catch (err: any) {
			console.error("Error fetching appointments:", err);
			setError(err.message || "Failed to load appointments");
		} finally {
			setLoading(false);
		}
	}, [userData?._id]);
	useEffect(() => {
		if (userData?._id) {
			fetchAppointments();
		}
	}, [userData, fetchAppointments]);

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

	const getUserInitials = (appointment: any) => {
		const fullName = appointment.userId?.fullName;
		if (fullName) {
			const name = fullName?.split(" ");
			return name[0][0] + name[1][0];
		}
	};

	if (loading) {
		return (
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-lg font-semibold text-gray-800">
						Upcoming Appointments
					</CardTitle>
					<Button variant="outline" size="sm" className="text-blue-600">
						View All
					</Button>
				</CardHeader>
				<CardContent className="py-6">
					<div className="flex justify-center items-center h-40">
						<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-lg font-semibold text-gray-800">
						Upcoming Appointments
					</CardTitle>
					<Button
						variant="outline"
						size="sm"
						className="text-blue-600"
						onClick={fetchAppointments}
					>
						Retry
					</Button>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<AlertCircle className="h-8 w-8 text-red-500 mb-2" />
						<p className="text-gray-700 mb-1">Failed to load appointments</p>
						<p className="text-sm text-gray-500">{error}</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-lg font-semibold text-gray-800">
					Upcoming Appointments
				</CardTitle>
				<Button
					variant="outline"
					size="sm"
					className="text-blue-600"
					onClick={() => router.push("/doctor/dashboard/appointments")}
				>
					View All
				</Button>
			</CardHeader>
			<CardContent>
				{appointments.length === 0 ? (
					<div className="text-center py-8">
						<Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
						<h3 className="text-gray-700 font-medium mb-1">
							No upcoming appointments
						</h3>
						<p className="text-sm text-gray-500">
							Your schedule is clear for now
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{appointments.map((appointment) => (
							<div
								key={appointment._id}
								className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
							>
								<div className="flex items-center">
									<div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
										{appointment.userId?.profileImage ? (
											<Image
												src={appointment.userId?.profileImage || ""}
												alt={appointment.userId?.fullName}
												width={40}
												height={40}
												className="object-cover"
											/>
										) : (
											<div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-xl">
												{getUserInitials(appointment)}
											</div>
										)}
									</div>
									<div>
										<h4 className="font-medium text-gray-800">
											{appointment.userId?.fullName}
										</h4>
										<div className="flex items-center text-sm text-gray-500 mt-1">
											<Clock className="h-3 w-3 mr-1" />
											<span>
												{format(new Date(appointment.date), "h:mm a")}
											</span>
											<span className="mx-1">•</span>
											<Calendar className="h-3 w-3 mr-1" />
											<span>
												{format(new Date(appointment.date), "MMM d, yyyy")}
											</span>
										</div>
									</div>
								</div>

								<div className="flex items-center">
									<Badge
										variant="secondary"
										className="mr-2 flex items-center gap-1"
									>
										{getAppointmentTypeIcon(appointment.type)}
										<span className="capitalize">{appointment.type}</span>
									</Badge>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() =>
													router.push(
														`/doctor/dashboard/appointments/${appointment._id}`
													)
												}
											>
												View Details
											</DropdownMenuItem>
											<DropdownMenuItem>Reschedule</DropdownMenuItem>
											<DropdownMenuItem className="text-red-600">
												Cancel
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
