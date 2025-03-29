"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Calendar,
	Clock,
	MapPin,
	Video,
	FileText,
	CheckCircle,
	X,
} from "lucide-react";
import { format, isPast, isToday, addDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

interface Appointment {
	_id: string;
	date: string;
	reason: string;
	notes?: string;
	type: "in-person" | "virtual";
	status: "scheduled" | "completed" | "cancelled";
	doctorId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
		specialization?: string;
	};
}

export default function AppointmentsPage() {
	const { userData } = useUser();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("upcoming");
	const router = useRouter();

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				if (!userData?._id) return;

				setLoading(true);
				const response = await fetch(
					`/api/appointments?userId=${userData._id}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch appointments");
				}

				const data = await response.json();

				if (data.success && data.appointments) {
					// Sort appointments by date (newest first)
					const sortedAppointments = data.appointments.sort(
						(a: Appointment, b: Appointment) =>
							new Date(a.date).getTime() - new Date(b.date).getTime()
					);
					setAppointments(sortedAppointments);
				}
			} catch (error) {
				console.error("Error fetching appointments:", error);
				toast.error("Failed to load appointments");
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [userData]);
	console.log("Data:", appointments);
	const upcomingAppointments = appointments.filter(
		(appointment) =>
			!isPast(new Date(appointment.date)) && appointment.status !== "cancelled"
	);

	const pastAppointments = appointments.filter(
		(appointment) =>
			isPast(new Date(appointment.date)) || appointment.status === "cancelled"
	);

	const cancelAppointment = async (appointmentId: string) => {
		// Show confirmation dialog
		if (!confirm("Are you sure you want to cancel this appointment?")) {
			return;
		}

		try {
			const response = await fetch(`/api/appointments/${appointmentId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "cancelled" }),
			});

			if (!response.ok) {
				throw new Error("Failed to cancel appointment");
			}

			// Update local state
			setAppointments(
				appointments.map((appointment) =>
					appointment._id === appointmentId
						? { ...appointment, status: "cancelled" }
						: appointment
				)
			);

			toast.success("Appointment cancelled successfully");
		} catch (error) {
			console.error("Error cancelling appointment:", error);
			toast.error("Failed to cancel appointment");
		}
	};

	const getStatusBadge = (status: string, date: string) => {
		const appointmentDate = new Date(date);

		if (status === "cancelled") {
			return <Badge variant="destructive">Cancelled</Badge>;
		}

		if (status === "completed") {
			return (
				<Badge
					variant="outline"
					className="bg-green-50 text-green-700 border-green-200"
				>
					Completed
				</Badge>
			);
		}

		if (isToday(appointmentDate)) {
			return <Badge className="bg-amber-500 hover:bg-amber-600">Today</Badge>;
		}

		if (isPast(appointmentDate)) {
			return (
				<Badge
					variant="outline"
					className="bg-gray-50 text-gray-700 border-gray-200"
				>
					Past
				</Badge>
			);
		}

		// Check if appointment is within the next 3 days
		if (appointmentDate < addDays(new Date(), 3)) {
			return (
				<Badge className="bg-orange-500 hover:bg-orange-600">
					Upcoming Soon
				</Badge>
			);
		}

		return <Badge className="bg-primary hover:bg-primary/90">Scheduled</Badge>;
	};

	const renderAppointmentCard = (appointment: Appointment) => {
		const appointmentDate = new Date(appointment.date);
		const isPastAppointment =
			isPast(appointmentDate) || appointment.status === "cancelled";

		return (
			<Card
				key={appointment._id}
				className={`mb-4 overflow-hidden ${
					appointment.status === "cancelled" ? "opacity-75" : ""
				}`}
			>
				<div
					className={`h-2 ${
						appointment.type === "virtual" ? "bg-indigo-500" : "bg-emerald-500"
					}`}
				></div>
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="text-lg font-semibold">
								Appointment with Dr. {appointment.doctorId.fullName}
							</CardTitle>
							<CardDescription>
								{format(appointmentDate, "EEEE, MMMM d, yyyy")}
							</CardDescription>
						</div>
						{getStatusBadge(appointment.status, appointment.date)}
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-3">
							<div className="flex items-center text-sm">
								<Clock className="mr-2 h-4 w-4 text-gray-500" />
								<span>{format(appointmentDate, "h:mm a")}</span>
							</div>
							<div className="flex items-center text-sm">
								{appointment.type === "virtual" ? (
									<>
										<Video className="mr-2 h-4 w-4 text-indigo-500" />
										<span>Virtual Appointment</span>
									</>
								) : (
									<>
										<MapPin className="mr-2 h-4 w-4 text-emerald-500" />
										<span>In-Person Visit</span>
									</>
								)}
							</div>
							{appointment.reason && (
								<div className="flex items-start text-sm">
									<FileText className="mr-2 h-4 w-4 text-gray-500 mt-0.5" />
									<span className="line-clamp-2">{appointment.reason}</span>
								</div>
							)}
						</div>
						<div className="flex flex-col space-y-2 md:items-end justify-end">
							<Button
								variant="outline"
								className="w-full md:w-auto"
								onClick={() =>
									router.push(
										`/patient/dashboard/upcoming-appointments/${appointment._id}`
									)
								}
							>
								View Details
							</Button>

							{!isPastAppointment && (
								<Button
									variant="destructive"
									className="w-full md:w-auto"
									onClick={() => cancelAppointment(appointment._id)}
								>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	const renderAppointmentSkeleton = () => (
		<Card className="mb-4">
			<CardHeader className="pb-2">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-1/2 mt-2" />
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex flex-col space-y-2 md:items-end justify-end">
						<Skeleton className="h-9 w-full md:w-32" />
						<Skeleton className="h-9 w-full md:w-32" />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
					<p className="text-gray-600">
						View and manage your upcoming and past appointments
					</p>
				</div>
				<Button
					className="mt-4 md:mt-0 bg-primary hover:bg-primary/90"
					onClick={() => router.push("/patient/dashboard/appointment")}
				>
					Book New Appointment
				</Button>
			</div>

			<Tabs
				defaultValue="upcoming"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList className="mb-4">
					<TabsTrigger value="upcoming" className="relative">
						Upcoming
						{upcomingAppointments.length > 0 && (
							<span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								{upcomingAppointments.length}
							</span>
						)}
					</TabsTrigger>
					<TabsTrigger value="past">Past</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming">
					{loading ? (
						Array(3)
							.fill(0)
							.map((_, index) => (
								<div key={index}>{renderAppointmentSkeleton()}</div>
							))
					) : upcomingAppointments.length > 0 ? (
						upcomingAppointments.map(renderAppointmentCard)
					) : (
						<div className="text-center py-12 bg-gray-50 rounded-lg">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
								<Calendar className="h-8 w-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No upcoming appointments
							</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">
								You don&apos;t have any upcoming appointments scheduled. Would
								you like to book a new appointment?
							</p>
							<Button
								onClick={() => router.push("/dashboard/book-appointment")}
								className="bg-primary hover:bg-primary/90"
							>
								Book Appointment
							</Button>
						</div>
					)}
				</TabsContent>

				<TabsContent value="past">
					{loading ? (
						Array(3)
							.fill(0)
							.map((_, index) => (
								<div key={index}>{renderAppointmentSkeleton()}</div>
							))
					) : pastAppointments.length > 0 ? (
						pastAppointments.map(renderAppointmentCard)
					) : (
						<div className="text-center py-12 bg-gray-50 rounded-lg">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
								<CheckCircle className="h-8 w-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No past appointments
							</h3>
							<p className="text-gray-600 max-w-md mx-auto">
								You don&apos;t have any past appointments. Once you complete
								appointments, they will appear here.
							</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
			<Toaster position="top-center" />
		</div>
	);
}
