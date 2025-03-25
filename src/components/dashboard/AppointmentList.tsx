"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Plus } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Appointment {
	_id: string;
	doctor: {
		_id: string;
		fullName: string;
		specialty: string;
	};
	date: string;
	time: string;
	status: string;
	location?: string;
	notes?: string;
}

export function AppointmentsList() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [upcomingAppointments, setUpcomingAppointments] = useState<
		Appointment[]
	>([]);
	const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch upcoming appointments
				const upcomingResponse = await axios.get(
					"/api/patient/appointments/upcoming"
				);
				setUpcomingAppointments(upcomingResponse.data.appointments);

				// Fetch past appointments
				const pastResponse = await axios.get("/api/patient/appointments/past");
				setPastAppointments(pastResponse.data.appointments);
			} catch (err) {
				console.error("Error fetching appointments:", err);
				setError("Failed to load appointments");
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, []);

	const handleReschedule = (id: string) => {
		router.push(`/patient/appointments/reschedule/${id}`);
	};

	const handleCancel = async (id: string) => {
		try {
			await axios.post(`/api/patient/appointments/${id}/cancel`);

			// Update the local state
			setUpcomingAppointments(
				upcomingAppointments.filter((appointment) => appointment._id !== id)
			);
		} catch (err) {
			console.error("Error canceling appointment:", err);
		}
	};

	return (
		<>
			<Card className="bg-white shadow-sm">
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle className="text-lg font-semibold">
							Appointments
						</CardTitle>
						<Button onClick={() => router.push("/patient/appointments/book")}>
							<Plus className="mr-2 h-4 w-4" /> Book New Appointment
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="upcoming" className="w-full">
						<TabsList className="grid grid-cols-2 mb-6">
							<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
							<TabsTrigger value="past">Past</TabsTrigger>
						</TabsList>

						<TabsContent value="upcoming">
							{loading ? (
								<div className="space-y-4">
									{[1, 2, 3].map((i) => (
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
							) : upcomingAppointments.length === 0 ? (
								<div className="text-center text-gray-500 py-8">
									<p className="mb-4">No upcoming appointments found.</p>
									<Button
										variant="outline"
										onClick={() => router.push("/patient/appointments/book")}
									>
										<Plus className="mr-2 h-4 w-4" /> Book New Appointment
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									{upcomingAppointments.map((appointment) => (
										<div
											key={appointment._id}
											className="p-4 bg-gray-50 rounded-lg"
										>
											<div className="flex flex-col md:flex-row md:justify-between md:items-center">
												<div>
													<h3 className="font-medium text-gray-900 text-lg">
														{appointment.doctor.fullName}
													</h3>
													<Badge
														variant="outline"
														className="mt-1 bg-primary/10 text-primary border-primary/20"
													>
														{appointment.doctor.specialty}
													</Badge>
												</div>
												<Badge
													variant={
														appointment.status === "confirmed"
															? "default"
															: "outline"
													}
													className="mt-2 md:mt-0 w-fit"
												>
													{appointment.status === "confirmed"
														? "Confirmed"
														: "Pending"}
												</Badge>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
												<div className="space-y-2">
													<div className="flex items-center text-sm text-gray-600">
														<Calendar className="w-4 h-4 mr-2 text-primary" />
														{new Date(appointment.date).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															}
														)}
													</div>
													<div className="flex items-center text-sm text-gray-600">
														<Clock className="w-4 h-4 mr-2 text-primary" />
														{appointment.time}
													</div>
												</div>
												<div>
													{appointment.location && (
														<p className="text-sm text-gray-600">
															<strong>Location:</strong> {appointment.location}
														</p>
													)}
													{appointment.notes && (
														<p className="text-sm text-gray-600 mt-1">
															<strong>Notes:</strong> {appointment.notes}
														</p>
													)}
												</div>
											</div>

											<div className="flex justify-end mt-4 gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleReschedule(appointment._id)}
												>
													Reschedule
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="text-red-600 border-red-200 hover:bg-red-50"
													onClick={() => handleCancel(appointment._id)}
												>
													Cancel
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</TabsContent>

						<TabsContent value="past">
							{loading ? (
								<div className="space-y-4">
									{[1, 2, 3].map((i) => (
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
							) : pastAppointments.length === 0 ? (
								<div className="text-center text-gray-500 py-8">
									No past appointments found.
								</div>
							) : (
								<div className="space-y-4">
									{pastAppointments.map((appointment) => (
										<div
											key={appointment._id}
											className="p-4 bg-gray-50 rounded-lg"
										>
											<div className="flex flex-col md:flex-row md:justify-between md:items-center">
												<div>
													<h3 className="font-medium text-gray-900 text-lg">
														{appointment.doctor.fullName}
													</h3>
													<Badge
														variant="outline"
														className="mt-1 bg-primary/10 text-primary border-primary/20"
													>
														{appointment.doctor.specialty}
													</Badge>
												</div>
												<Badge
													variant="outline"
													className="mt-2 md:mt-0 w-fit bg-gray-100 text-gray-700"
												>
													Completed
												</Badge>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
												<div className="space-y-2">
													<div className="flex items-center text-sm text-gray-600">
														<Calendar className="w-4 h-4 mr-2 text-primary" />
														{new Date(appointment.date).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															}
														)}
													</div>
													<div className="flex items-center text-sm text-gray-600">
														<Clock className="w-4 h-4 mr-2 text-primary" />
														{appointment.time}
													</div>
												</div>
												<div>
													{appointment.location && (
														<p className="text-sm text-gray-600">
															<strong>Location:</strong> {appointment.location}
														</p>
													)}
													{appointment.notes && (
														<p className="text-sm text-gray-600 mt-1">
															<strong>Notes:</strong> {appointment.notes}
														</p>
													)}
												</div>
											</div>

											<div className="flex justify-end mt-4 gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														router.push(
															`/patient/appointments/${appointment._id}`
														)
													}
												>
													View Details
												</Button>
											</div>
										</div>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</>
	);
}
