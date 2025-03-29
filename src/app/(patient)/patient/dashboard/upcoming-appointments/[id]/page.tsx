"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Calendar,
	Clock,
	MapPin,
	Video,
	AlertCircle,
	ArrowLeft,
	Phone,
	Mail,
	X,
} from "lucide-react";
import { format, isPast, isToday, addDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
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
		phoneNumber?: string;
		profileImage?: string;
		specialization?: string;
	};
}

export default function AppointmentDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const { userData } = useUser();
	const [appointment, setAppointment] = useState<Appointment | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppointmentDetails = async () => {
			try {
				if (!params.id) return;

				setLoading(true);
				const response = await fetch(`/api/appointments/${params.id}`);

				if (!response.ok) {
					throw new Error("Failed to fetch appointment details");
				}

				const data = await response.json();
				if (data.success && data.appointment) {
					setAppointment(data.appointment);
				} else {
					toast.error("Appointment not found");
					router.push("/patient/dashboard/upcoming-appointments");
				}
			} catch (error) {
				console.error("Error fetching appointment details:", error);
				toast.error("Failed to load appointment details");
			} finally {
				setLoading(false);
			}
		};

		fetchAppointmentDetails();
	}, [params.id, router]);

	const cancelAppointment = async () => {
		// Show confirmation dialog
		if (!confirm("Are you sure you want to cancel this appointment?")) {
			return;
		}

		try {
			if (!appointment?._id) return;

			const response = await fetch(`/api/appointments/${appointment._id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "cancelled" }),
			});

			if (!response.ok) {
				throw new Error("Failed to cancel appointment");
			}

			const data = await response.json();
			if (data.success) {
				setAppointment({
					...appointment,
					status: "cancelled",
				});
				toast.success("Appointment cancelled successfully");
			}
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

	if (loading) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="flex items-center mb-6">
					<Button
						variant="ghost"
						className="mr-4"
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
					<Skeleton className="h-8 w-64" />
				</div>

				<Card>
					<CardHeader>
						<Skeleton className="h-7 w-3/4 mb-2" />
						<Skeleton className="h-5 w-1/2" />
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="space-y-4">
								<Skeleton className="h-5 w-32 mb-2" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							</div>

							<div className="space-y-4">
								<Skeleton className="h-5 w-32 mb-2" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>

							<div className="space-y-4">
								<Skeleton className="h-5 w-32 mb-2" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Skeleton className="h-10 w-32" />
					</CardFooter>
				</Card>
			</div>
		);
	}

	if (!appointment) {
		return (
			<div className="container mx-auto py-8 px-4 text-center">
				<h1 className="text-2xl font-bold mb-4">Appointment Not Found</h1>
				<p className="mb-6">
					The appointment you&apos;re looking for doesn&apos;t exist or you
					don&apos;t have permission to view it.
				</p>
				<Button
					onClick={() =>
						router.push("/patient/dashboard/upcoming-appointments")
					}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Appointments
				</Button>
			</div>
		);
	}

	const appointmentDate = new Date(appointment.date);
	const isPastAppointment =
		isPast(appointmentDate) || appointment.status === "cancelled";
	const doctor = appointment.doctorId;

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex items-center mb-6">
				<Button variant="ghost" className="mr-4" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<h1 className="text-2xl font-bold">Appointment Details</h1>
			</div>

			<Card>
				<div
					className={`h-2 ${
						appointment.type === "virtual" ? "bg-indigo-500" : "bg-emerald-500"
					}`}
				></div>
				<CardHeader>
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="text-xl">
								Appointment with Dr. {doctor.fullName}
							</CardTitle>
							<CardDescription>
								{format(appointmentDate, "EEEE, MMMM d, yyyy")} at{" "}
								{format(appointmentDate, "h:mm a")}
							</CardDescription>
						</div>
						{getStatusBadge(appointment.status, appointment.date)}
					</div>
				</CardHeader>

				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<h3 className="font-medium text-gray-900 mb-3">
								Appointment Information
							</h3>
							<div className="space-y-3">
								<div className="flex items-center text-sm">
									<Calendar className="mr-2 h-4 w-4 text-gray-500" />
									<span>{format(appointmentDate, "MMMM d, yyyy")}</span>
								</div>
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
								{appointment.status === "cancelled" && (
									<div className="flex items-center text-sm text-red-500">
										<AlertCircle className="mr-2 h-4 w-4" />
										<span>This appointment has been cancelled</span>
									</div>
								)}
							</div>
						</div>

						<div>
							<h3 className="font-medium text-gray-900 mb-3">
								Doctor Information
							</h3>
							<div className="flex items-start space-x-3 mb-3">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={doctor.profileImage}
										alt={doctor.fullName}
									/>
									<AvatarFallback>
										{doctor.fullName
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Dr. {doctor.fullName}</p>
									{doctor.specialization && (
										<p className="text-sm text-gray-500">
											{doctor.specialization}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center text-sm">
									<Mail className="mr-2 h-4 w-4 text-gray-500" />
									<span>{doctor.email}</span>
								</div>
								{doctor.phoneNumber && (
									<div className="flex items-center text-sm">
										<Phone className="mr-2 h-4 w-4 text-gray-500" />
										<span>{doctor.phoneNumber}</span>
									</div>
								)}
							</div>
						</div>

						<div>
							<h3 className="font-medium text-gray-900 mb-3">
								Appointment Details
							</h3>
							{appointment.reason && (
								<div className="mb-4">
									<p className="text-sm font-medium text-gray-700 mb-1">
										Reason for Visit:
									</p>
									<p className="text-sm text-gray-600">{appointment.reason}</p>
								</div>
							)}

							{appointment.notes && (
								<div>
									<p className="text-sm font-medium text-gray-700 mb-1">
										Additional Notes:
									</p>
									<p className="text-sm text-gray-600">{appointment.notes}</p>
								</div>
							)}

							{appointment.type === "virtual" && !isPastAppointment && (
								<div className="mt-4 p-3 bg-indigo-50 rounded-md">
									<p className="text-sm font-medium text-indigo-800 mb-1">
										Virtual Appointment Link:
									</p>
									<p className="text-sm text-indigo-700">
										The link to join your virtual appointment will be sent to
										your email 30 minutes before the scheduled time.
									</p>
								</div>
							)}
						</div>
					</div>
				</CardContent>

				<Separator />

				<CardFooter className="flex justify-between pt-6">
					<Button
						variant="outline"
						onClick={() =>
							router.push("/patient/dashboard/upcoming-appointments")
						}
					>
						Back to Appointments
					</Button>

					{!isPastAppointment && appointment.status !== "cancelled" && (
						<Button variant="destructive" onClick={cancelAppointment}>
							<X className="mr-2 h-4 w-4" />
							Cancel Appointment
						</Button>
					)}
				</CardFooter>
			</Card>
			<Toaster position="top-center" />
		</div>
	);
}
