"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { format, isToday, isPast, isFuture } from "date-fns";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	Loader2,
	MapPin,
	Phone,
	Search,
	Video,
	XCircle,
} from "lucide-react";
import Image from "next/image";
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

function DoctorAppointmentsPage() {
	const { userData } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [typeFilter, setTypeFilter] = useState<string>("all");

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
			setAppointments(data.appointments || []);
		} catch (err: any) {
			console.error("Error fetching appointments:", err);
			setError(err.message || "Failed to load appointments");
		} finally {
			setLoading(false);
		}
	}, [userData]);

	useEffect(() => {
		if (userData?._id) {
			fetchAppointments();
		}
	}, [userData, fetchAppointments]);

	// Filter functions
	const filterAppointments = (appointments: Appointment[]) => {
		return appointments.filter((apt) => {
			// Search term filter
			const matchesSearch =
				searchTerm === "" ||
				apt.userId?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				apt.reason.toLowerCase().includes(searchTerm.toLowerCase());

			// Status filter
			const matchesStatus =
				statusFilter === "all" || apt.status === statusFilter;

			// Type filter
			const matchesType = typeFilter === "all" || apt.type === typeFilter;

			return matchesSearch && matchesStatus && matchesType;
		});
	};

	// Get appointments by time period
	const getUpcomingAppointments = () => {
		return filterAppointments(
			appointments.filter((apt) => isFuture(new Date(apt.date)))
		).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	};

	const getPastAppointments = () => {
		return filterAppointments(
			appointments.filter((apt) => isPast(new Date(apt.date)))
		).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	};

	const getTodayAppointments = () => {
		return filterAppointments(
			appointments.filter((apt) => isToday(new Date(apt.date)))
		).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	};

	const upcomingAppointments = getUpcomingAppointments();
	const pastAppointments = getPastAppointments();
	const todayAppointments = getTodayAppointments();

	// Helper function to display appointment status
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "scheduled":
				return (
					<Badge
						variant="outline"
						className="bg-blue-100 text-blue-800 hover:bg-blue-100"
					>
						Scheduled
					</Badge>
				);
			case "completed":
				return (
					<Badge
						variant="outline"
						className="bg-green-100 text-green-800 hover:bg-green-100"
					>
						Completed
					</Badge>
				);
			case "cancelled":
				return (
					<Badge
						variant="outline"
						className="bg-red-100 text-red-800 hover:bg-red-100"
					>
						Cancelled
					</Badge>
				);
			case "no-show":
				return (
					<Badge
						variant="outline"
						className="bg-gray-100 text-gray-800 hover:bg-gray-100"
					>
						No Show
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

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
			<div className="pl-[310px] pr-6 py-6 bg-gray-50 min-h-screen">
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<Loader2 className="h-10 w-10 mx-auto animate-spin text-blue-600 mb-4" />
						<p className="text-gray-600">Loading appointments...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="pl-[310px] pr-6 py-6 bg-gray-50 min-h-screen">
				<Card>
					<CardContent className="py-10">
						<div className="flex flex-col items-center justify-center text-center">
							<AlertCircle className="h-10 w-10 text-red-500 mb-4" />
							<h3 className="text-lg font-medium text-gray-800 mb-2">
								Failed to load appointments
							</h3>
							<p className="text-gray-600 mb-4">{error}</p>
							<Button onClick={fetchAppointments}>Try Again</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="pl-[310px] pr-6 py-6 bg-gray-50 min-h-screen">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
				<p className="text-gray-500 mt-1">Manage your scheduled appointments</p>
			</div>

			<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div className="relative w-full md:max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search by patient name or reason..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 bg-white border-gray-200"
					/>
				</div>
				<div className="flex flex-col sm:flex-row gap-2">
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-full sm:w-[140px] bg-white">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							<SelectItem value="scheduled">Scheduled</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
							<SelectItem value="no-show">No Show</SelectItem>
						</SelectContent>
					</Select>
					<Select value={typeFilter} onValueChange={setTypeFilter}>
						<SelectTrigger className="w-full sm:w-[140px] bg-white">
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="in-person">In-Person</SelectItem>
							<SelectItem value="virtual">Virtual</SelectItem>
							<SelectItem value="phone">Phone</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={fetchAppointments} variant="outline">
						Refresh
					</Button>
				</div>
			</div>

			<Tabs defaultValue="upcoming" className="w-full">
				<TabsList className="grid grid-cols-3 mb-6">
					<TabsTrigger value="today">
						Today ({todayAppointments.length})
					</TabsTrigger>
					<TabsTrigger value="upcoming">
						Upcoming ({upcomingAppointments.length - todayAppointments.length})
					</TabsTrigger>
					<TabsTrigger value="past">
						Past ({pastAppointments.length})
					</TabsTrigger>
				</TabsList>

				{/* Today's Appointments */}
				<TabsContent value="today">
					{todayAppointments.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-10 text-center">
								<Calendar className="h-12 w-12 text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-800 mb-2">
									No appointments today
								</h3>
								<p className="text-gray-500 max-w-md">
									You don&apos;t have any appointments scheduled for today.
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{todayAppointments.map((appointment) =>
								renderAppointmentCard(appointment)
							)}
						</div>
					)}
				</TabsContent>

				{/* Upcoming Appointments */}
				<TabsContent value="upcoming">
					{upcomingAppointments.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-10 text-center">
								<Calendar className="h-12 w-12 text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-800 mb-2">
									No upcoming appointments
								</h3>
								<p className="text-gray-500 max-w-md">
									You don&apos;t have any upcoming appointments scheduled.
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{upcomingAppointments.map((appointment) =>
								renderAppointmentCard(appointment)
							)}
						</div>
					)}
				</TabsContent>

				{/* Past Appointments */}
				<TabsContent value="past">
					{pastAppointments.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-10 text-center">
								<Calendar className="h-12 w-12 text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-800 mb-2">
									No past appointments
								</h3>
								<p className="text-gray-500 max-w-md">
									You don&apos;t have any past appointment records.
								</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{pastAppointments.map((appointment) =>
								renderAppointmentCard(appointment)
							)}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);

	function renderAppointmentCard(appointment: Appointment) {
		const appointmentDate = new Date(appointment.date);
		const isUpcoming = isFuture(appointmentDate);

		return (
			<Card key={appointment._id} className="hover:shadow-md transition-shadow">
				<CardContent className="p-0">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100">
						<div className="flex items-center mb-2 sm:mb-0">
							<div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
								{appointment.userId?.profileImage ? (
									<Image
										src={appointment?.userId?.profileImage || ""}
										alt={appointment?.userId?.fullName}
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
									{appointment?.userId?.fullName}
								</h4>
								<p className="text-sm text-gray-500">
									{appointment?.userId?.email}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{getStatusBadge(appointment?.status)}
							<Badge
								variant="outline"
								className="flex items-center gap-1 bg-gray-50"
							>
								{getAppointmentTypeIcon(appointment?.type)}
								<span className="capitalize">{appointment?.type}</span>
							</Badge>
						</div>
					</div>

					<div className="p-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<div className="flex items-center mb-3">
									<Calendar className="h-4 w-4 text-gray-500 mr-2" />
									<div>
										<p className="text-sm text-gray-500">Date</p>
										<p className="font-medium text-gray-800">
											{format(appointmentDate, "EEEE, MMMM d, yyyy")}
										</p>
									</div>
								</div>
								<div className="flex items-center">
									<Clock className="h-4 w-4 text-gray-500 mr-2" />
									<div>
										<p className="text-sm text-gray-500">Time</p>
										<p className="font-medium text-gray-800">
											{format(appointmentDate, "h:mm a")}
										</p>
									</div>
								</div>
							</div>

							<div>
								<p className="text-sm text-gray-500 mb-1">Reason</p>
								<p className="text-gray-800">{appointment.reason}</p>

								{appointment.notes && (
									<>
										<p className="text-sm text-gray-500 mt-3 mb-1">Notes</p>
										<p className="text-gray-800 text-sm">
											{appointment?.notes}
										</p>
									</>
								)}
							</div>
						</div>

						<div className="flex justify-end mt-4 gap-2">
							<Button
								variant="outline"
								onClick={() =>
									router.push(
										`/doctor/dashboard/appointments/${appointment?._id}`
									)
								}
							>
								View Details
							</Button>

							{isUpcoming && appointment.status === "scheduled" && (
								<>
									<Button
										variant="outline"
										className="text-blue-600 border-blue-200 hover:bg-blue-50"
									>
										Reschedule
									</Button>
									<Button
										variant="default"
										className="bg-green-600 hover:bg-green-700"
									>
										<CheckCircle className="h-4 w-4 mr-2" />
										Mark Completed
									</Button>
								</>
							)}

							{isUpcoming && appointment.status === "scheduled" && (
								<Button
									variant="outline"
									className="text-red-600 border-red-200 hover:bg-red-50"
								>
									<XCircle className="h-4 w-4 mr-2" />
									Cancel
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}
}

export default withRoleAccess(DoctorAppointmentsPage, ["doctor"]);
