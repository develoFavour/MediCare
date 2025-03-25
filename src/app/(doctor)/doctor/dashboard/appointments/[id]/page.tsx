"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	AlertCircle,
	Calendar,
	ChevronLeft,
	Clock,
	Loader2,
	Mail,
	MapPin,
	MessageSquare,
	Phone,
	Video,
	FileText,
	CheckCircle,
	XCircle,
	AlertTriangle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";

interface Appointment {
	_id: string;
	userId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
	};
	doctorId: {
		_id: string;
		fullName: string;
		email: string;
	};
	date: string;
	reason: string;
	type: "in-person" | "virtual" | "phone";
	notes: string;
	status: "scheduled" | "completed" | "cancelled" | "no-show";
	createdAt: string;
}

function AppointmentDetailsPage() {
	const { id } = useParams() as { id: string };
	const router = useRouter();
	const { userData } = useUser();
	const [appointment, setAppointment] = useState<Appointment | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogAction, setDialogAction] = useState<
		"complete" | "cancel" | "noshow"
	>("complete");
	const [notes, setNotes] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const fetchAppointmentDetails = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/appointments/${id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch appointment details");
			}

			const data = await response.json();
			setAppointment(data.appointment);
		} catch (err: any) {
			console.error("Error fetching appointment details:", err);
			setError(err.message || "Failed to load appointment details");
		} finally {
			setLoading(false);
		}
	}, [id]);
	useEffect(() => {
		if (userData?._id && id) {
			fetchAppointmentDetails();
		}
	}, [userData, id, fetchAppointmentDetails]);

	const handleStatusChange = async () => {
		if (!appointment) return;

		try {
			setSubmitting(true);

			let newStatus = "";
			switch (dialogAction) {
				case "complete":
					newStatus = "completed";
					break;
				case "cancel":
					newStatus = "cancelled";
					break;
				case "noshow":
					newStatus = "no-show";
					break;
			}

			const response = await fetch(`/api/appointments/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: newStatus,
					notes: notes || appointment.notes,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update appointment status");
			}

			// Update local state
			setAppointment((prev) =>
				prev
					? { ...prev, status: newStatus as any, notes: notes || prev.notes }
					: null
			);
			toast.success(`Appointment marked as ${newStatus}`);
			setDialogOpen(false);
		} catch (err: any) {
			console.error("Error updating appointment status:", err);
			toast.error(err.message || "Failed to update appointment status");
		} finally {
			setSubmitting(false);
		}
	};

	const openStatusDialog = (action: "complete" | "cancel" | "noshow") => {
		setDialogAction(action);
		setNotes("");
		setDialogOpen(true);
	};

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
				return <Video className="h-5 w-5 text-blue-600" />;
			case "phone":
				return <Phone className="h-5 w-5 text-green-600" />;
			default:
				return <MapPin className="h-5 w-5 text-amber-600" />;
		}
	};

	const getAppointmentTypeLabel = (type: string) => {
		switch (type) {
			case "virtual":
				return "Virtual Appointment (Telehealth)";
			case "phone":
				return "Phone Consultation";
			default:
				return "In-Person Appointment";
		}
	};

	if (loading) {
		return (
			<div className="  py-6 bg-gray-50 min-h-screen">
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<Loader2 className="h-10 w-10 mx-auto animate-spin text-blue-600 mb-4" />
						<p className="text-gray-600">Loading appointment details...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !appointment) {
		return (
			<div className=" py-6 bg-gray-50 min-h-screen">
				<Card>
					<CardContent className="py-10">
						<div className="flex flex-col items-center justify-center text-center">
							<AlertCircle className="h-10 w-10 text-red-500 mb-4" />
							<h3 className="text-lg font-medium text-gray-800 mb-2">
								Failed to load appointment
							</h3>
							<p className="text-gray-600 mb-4">
								{error || "Appointment not found"}
							</p>
							<div className="space-x-4">
								<Button onClick={fetchAppointmentDetails}>Try Again</Button>
								<Button variant="outline" onClick={() => router.back()}>
									Go Back
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const appointmentDate = new Date(appointment.date);
	const isUpcoming = new Date() < appointmentDate;
	const isPastDate = new Date() > appointmentDate;

	return (
		<div className=" py-6 bg-gray-50 min-h-screen">
			<div className="mb-6 flex items-center">
				<Button variant="ghost" onClick={() => router.back()} className="mr-4">
					<ChevronLeft className="h-4 w-4 mr-2" />
					Back
				</Button>
				<div>
					<h1 className="text-2xl font-bold text-gray-800">
						Appointment Details
					</h1>
					<p className="text-gray-500 mt-1">
						View and manage appointment information
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader className="pb-0">
							<div className="flex justify-between items-center">
								<CardTitle className="text-xl font-semibold text-gray-800">
									Appointment Information
								</CardTitle>
								<div className="flex items-center space-x-2">
									{getStatusBadge(appointment.status)}
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="space-y-6">
								<div className="flex items-start">
									{getAppointmentTypeIcon(appointment.type)}
									<div className="ml-3">
										<h3 className="font-medium text-gray-800">
											{getAppointmentTypeLabel(appointment.type)}
										</h3>
										<p className="text-sm text-gray-500">
											{appointment.type === "in-person"
												? "Visit our clinic at the scheduled time"
												: appointment.type === "virtual"
												? "You'll receive a link to join the video call"
												: "We'll call you at the scheduled time"}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex items-start">
										<Calendar className="h-5 w-5 text-gray-500" />
										<div className="ml-3">
											<h3 className="font-medium text-gray-800">
												Appointment Date
											</h3>
											<p className="text-gray-600">
												{format(appointmentDate, "EEEE, MMMM d, yyyy")}
											</p>
										</div>
									</div>

									<div className="flex items-start">
										<Clock className="h-5 w-5 text-gray-500" />
										<div className="ml-3">
											<h3 className="font-medium text-gray-800">
												Appointment Time
											</h3>
											<p className="text-gray-600">
												{format(appointmentDate, "h:mm a")}
											</p>
										</div>
									</div>
								</div>

								<div className="border-t border-gray-100 pt-4">
									<h3 className="font-medium text-gray-800 mb-2">
										Reason for Visit
									</h3>
									<p className="text-gray-600 bg-gray-50 p-3 rounded-md">
										{appointment.reason}
									</p>
								</div>

								{appointment.notes && (
									<div className="border-t border-gray-100 pt-4">
										<h3 className="font-medium text-gray-800 mb-2">Notes</h3>
										<p className="text-gray-600 bg-gray-50 p-3 rounded-md">
											{appointment.notes}
										</p>
									</div>
								)}

								<div className="border-t border-gray-100 pt-4">
									<h3 className="font-medium text-gray-800 mb-2">Created On</h3>
									<p className="text-gray-600">
										{format(
											new Date(appointment.createdAt),
											"MMMM d, yyyy 'at' h:mm a"
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{appointment.status === "scheduled" && (
						<Card>
							<CardHeader className="pb-0">
								<CardTitle className="text-xl font-semibold text-gray-800">
									Actions
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-6">
								<div className="flex flex-wrap gap-3">
									<Button
										onClick={() => openStatusDialog("complete")}
										className="bg-green-600 hover:bg-green-700"
										disabled={!isPastDate}
									>
										<CheckCircle className="h-4 w-4 mr-2" />
										Mark as Completed
									</Button>
									<Button
										variant="outline"
										className="text-red-600 border-red-200 hover:bg-red-50"
										onClick={() => openStatusDialog("cancel")}
									>
										<XCircle className="h-4 w-4 mr-2" />
										Cancel Appointment
									</Button>
									<Button
										variant="outline"
										className="text-gray-600 border-gray-200 hover:bg-gray-50"
										onClick={() => openStatusDialog("noshow")}
										disabled={!isPastDate}
									>
										<AlertTriangle className="h-4 w-4 mr-2" />
										Mark as No-Show
									</Button>
								</div>

								{!isPastDate && appointment.status === "scheduled" && (
									<div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md flex items-start">
										<AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
										<p className="text-sm">
											You can mark an appointment as completed or no-show only
											after the scheduled date and time has passed.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader className="pb-0">
							<CardTitle className="text-lg font-semibold text-gray-800">
								Patient Information
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="flex items-center mb-4">
								<div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
									<Image
										src={appointment.userId?.profileImage || ""}
										alt={appointment.userId?.fullName}
										width={64}
										height={64}
										className="object-cover"
									/>
								</div>
								<div>
									<h3 className="font-medium text-gray-800 text-lg">
										{appointment.userId?.fullName}
									</h3>
									<p className="text-gray-500 text-sm">Patient</p>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center">
									<Mail className="h-4 w-4 text-gray-500 mr-3" />
									<span className="text-gray-600">
										{appointment.userId?.email}
									</span>
								</div>

								<div className="pt-3 flex gap-2 ">
									<Button variant="outline" className="w-full" size="sm">
										<FileText className="h-4 w-4 mr-2" />
										View Records
									</Button>
									<Button variant="default" className="w-full" size="sm">
										<MessageSquare className="h-4 w-4 mr-2" />
										Message
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-0">
							<CardTitle className="text-lg font-semibold text-gray-800">
								Additional Options
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="space-y-2">
								<Button variant="outline" className="w-full justify-start">
									<Calendar className="h-4 w-4 mr-2" />
									Schedule Follow-up
								</Button>
								<Button variant="outline" className="w-full justify-start">
									<FileText className="h-4 w-4 mr-2" />
									Create Prescription
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Status Change Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{dialogAction === "complete"
								? "Mark Appointment as Completed"
								: dialogAction === "cancel"
								? "Cancel Appointment"
								: "Mark Appointment as No-Show"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<p className="text-gray-600">
							{dialogAction === "complete"
								? "Confirm that this appointment has been completed."
								: dialogAction === "cancel"
								? "Are you sure you want to cancel this appointment?"
								: "Confirm that the patient did not attend this appointment."}
						</p>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								{dialogAction === "complete"
									? "Add any notes about the appointment (optional)"
									: dialogAction === "cancel"
									? "Reason for cancellation (optional)"
									: "Notes about no-show (optional)"}
							</label>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder={
									dialogAction === "complete"
										? "Treatment notes, follow-up plans, etc."
										: dialogAction === "cancel"
										? "Reason for cancelling this appointment"
										: "Any notes about patient no-show"
								}
								className="min-h-[100px]"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleStatusChange}
							disabled={submitting}
							className={
								dialogAction === "complete"
									? "bg-green-600 hover:bg-green-700"
									: dialogAction === "cancel"
									? "bg-red-600 hover:bg-red-700"
									: "bg-gray-600 hover:bg-gray-700"
							}
						>
							{submitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								<>
									{dialogAction === "complete"
										? "Confirm Completion"
										: dialogAction === "cancel"
										? "Confirm Cancellation"
										: "Confirm No-Show"}
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default withRoleAccess(AppointmentDetailsPage, ["doctor"]);
