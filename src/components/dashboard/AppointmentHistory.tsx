"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Calendar,
	Clock,
	MapPin,
	Video,
	Phone,
	Plus,
	Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useRouter } from "next/navigation";

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
	type: "in-person" | "virtual" | "phone";
	location?: string;
	notes?: string;
}

export function AppointmentHistory() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [upcomingAppointments, setUpcomingAppointments] = useState<
		Appointment[]
	>([]);
	const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

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

	// Filter functions
	const filterAppointments = (appointments: Appointment[]) => {
		return appointments.filter((apt) => {
			// Search term filter
			const matchesSearch =
				searchTerm === "" ||
				apt.doctor?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				apt.doctor?.specialty.toLowerCase().includes(searchTerm.toLowerCase());

			// Status filter
			const matchesStatus =
				statusFilter === "all" || apt.status === statusFilter;

			// Type filter
			const matchesType = typeFilter === "all" || apt.type === typeFilter;

			return matchesSearch && matchesStatus && matchesType;
		});
	};

	const filteredUpcoming = filterAppointments(upcomingAppointments);
	const filteredPast = filterAppointments(pastAppointments);

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold">Appointments</CardTitle>
					<Button onClick={() => router.push("/patient/appointments/book")}>
						<Plus className="mr-2 h-4 w-4" /> Book New Appointment
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-6 space-y-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search by doctor name or specialty..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="confirmed">Confirmed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
						<Select value={typeFilter} onValueChange={setTypeFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="in-person">In-Person</SelectItem>
								<SelectItem value="virtual">Virtual</SelectItem>
								<SelectItem value="phone">Phone</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<Tabs defaultValue="upcoming" className="w-full">
					<TabsList className="grid grid-cols-2 mb-6">
						<TabsTrigger value="upcoming">
							Upcoming ({filteredUpcoming.length})
						</TabsTrigger>
						<TabsTrigger value="past">Past ({filteredPast.length})</TabsTrigger>
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
						) : filteredUpcoming.length === 0 ? (
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
								{filteredUpcoming.map((appointment) => (
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
											<div className="flex items-center gap-2 mt-2 md:mt-0">
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
													{getAppointmentTypeIcon(appointment.type)}
													<span className="capitalize">{appointment.type}</span>
												</Badge>
											</div>
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
												{appointment.location && (
													<div className="flex items-center text-sm text-gray-600">
														<MapPin className="w-4 h-4 mr-2 text-primary" />
														{appointment.location}
													</div>
												)}
											</div>
											<div>
												{appointment.notes && (
													<p className="text-sm text-gray-600">
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
														`/patient/appointments/reschedule/${appointment._id}`
													)
												}
											>
												Reschedule
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 border-red-200 hover:bg-red-50"
												onClick={() =>
													router.push(
														`/patient/appointments/cancel/${appointment._id}`
													)
												}
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
						) : filteredPast.length === 0 ? (
							<div className="text-center text-gray-500 py-8">
								No past appointments found.
							</div>
						) : (
							<div className="space-y-4">
								{filteredPast.map((appointment) => (
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
												{appointment.status.charAt(0).toUpperCase() +
													appointment.status.slice(1)}
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
												<div className="flex items-center text-sm text-gray-600">
													{getAppointmentTypeIcon(appointment.type)}
													<span className="ml-2 capitalize">
														{appointment.type} appointment
													</span>
												</div>
											</div>
											<div>
												{appointment.notes && (
													<p className="text-sm text-gray-600">
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
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													router.push(
														`/patient/appointments/book?doctor=${appointment.doctor._id}`
													)
												}
											>
												Book Again
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
	);
}
