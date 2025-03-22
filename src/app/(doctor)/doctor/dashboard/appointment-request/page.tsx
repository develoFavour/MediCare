"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Calendar, User, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AppointmentRequest {
	_id: string;
	userId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
	};
	symptoms: string;
	status: "pending" | "approved" | "rejected";
	assignedDoctor: string;
	createdAt: string;
	updatedAt: string;
}

function AppointmentRequestPage() {
	const { userData } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [appointmentRequests, setAppointmentRequests] = useState<
		AppointmentRequest[]
	>([]);
	const [selectedRequest, setSelectedRequest] =
		useState<AppointmentRequest | null>(null);
	const [schedulingOpen, setSchedulingOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState("");
	const [notes, setNotes] = useState("");
	const [appointmentType, setAppointmentType] = useState("in-person");
	const [submitting, setSubmitting] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const fetchAppointmentRequests = useCallback(async () => {
		if (!userData?._id) return;

		try {
			setLoading(true);
			console.log(`Fetching appointment requests for doctor: ${userData._id}`);

			const response = await fetch(
				`/api/doctors/appointment-requests?doctorId=${userData._id}`
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || "Failed to fetch appointment requests"
				);
			}

			const data = await response.json();
			console.log("Appointment requests data:", data);

			setAppointmentRequests(data.appointmentRequests || []);
		} catch (error) {
			console.error("Error fetching appointment requests:", error);
			toast.error("Failed to load appointment requests");
		} finally {
			setLoading(false);
		}
	}, [userData]);

	useEffect(() => {
		if (userData?._id) {
			fetchAppointmentRequests();
		}
	}, [userData, fetchAppointmentRequests]);

	const handleScheduleAppointment = (request: AppointmentRequest) => {
		setSelectedRequest(request);
		setSchedulingOpen(true);
		// Reset form fields
		setSelectedDate(undefined);
		setSelectedTime("");
		setNotes("");
		setAppointmentType("in-person");
	};

	const handleSubmitAppointment = async () => {
		if (!selectedRequest || !selectedDate || !selectedTime) {
			toast.error("Please select a date and time");
			return;
		}

		try {
			setSubmitting(true);

			const appointmentDateTime = new Date(selectedDate);
			const [hours, minutes] = selectedTime.split(":").map(Number);
			appointmentDateTime.setHours(hours, minutes);

			console.log("Scheduling appointment:", {
				appointmentRequestId: selectedRequest._id,
				date: appointmentDateTime.toISOString(),
				notes,
				type: appointmentType,
			});

			const response = await fetch("/api/appointments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appointmentRequestId: selectedRequest._id,
					date: appointmentDateTime.toISOString(),
					notes,
					type: appointmentType,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to schedule appointment");
			}

			const data = await response.json();
			console.log("Appointment scheduled successfully:", data);

			toast.success("Appointment scheduled successfully");
			setSchedulingOpen(false);
			fetchAppointmentRequests(); // Refresh the list
		} catch (error: any) {
			console.error("Error scheduling appointment:", error);
			toast.error(error.message || "Failed to schedule appointment");
		} finally {
			setSubmitting(false);
		}
	};

	const filteredRequests = appointmentRequests.filter((request) => {
		return (
			searchTerm === "" ||
			request.userId.fullName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			request.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	const timeSlots = [
		"09:00",
		"09:30",
		"10:00",
		"10:30",
		"11:00",
		"11:30",
		"13:00",
		"13:30",
		"14:00",
		"14:30",
		"15:00",
		"15:30",
		"16:00",
		"16:30",
	];

	if (loading) {
		return (
			<div className="pl-[310px] pr-6 py-6 flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
					<p className="text-gray-600">Loading appointment requests...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pl-[310px] pr-6 py-6 bg-gray-50 min-h-screen">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">
					Appointment Requests
				</h1>
				<p className="text-gray-500 mt-1">
					Manage and schedule appointments with your assigned patients
				</p>
			</div>

			<div className="mb-6 flex items-center justify-between">
				<div className="relative w-full max-w-md">
					<Input
						placeholder="Search by patient name or symptoms..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 bg-white border-gray-200"
					/>
					<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
				</div>
				<Button
					onClick={fetchAppointmentRequests}
					variant="outline"
					className="ml-2"
				>
					Refresh
				</Button>
			</div>

			{filteredRequests.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-10">
						<div className="rounded-full bg-blue-100 p-3 mb-4">
							<Calendar className="h-6 w-6 text-blue-600" />
						</div>
						<h3 className="text-lg font-medium text-gray-800 mb-2">
							No appointment requests found
						</h3>
						<p className="text-gray-500 text-center max-w-md">
							You don&apos;t have any patients waiting to be scheduled. Check
							back later or refresh the page.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredRequests.map((request) => (
						<Card
							key={request._id}
							className="overflow-hidden hover:shadow-md transition-shadow"
						>
							<CardHeader className="bg-blue-50 pb-2">
								<div className="flex justify-between items-start">
									<CardTitle className="text-lg font-semibold text-gray-800">
										{request.userId.fullName}
									</CardTitle>
									<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
										Pending Schedule
									</Badge>
								</div>
								<p className="text-sm text-gray-500">
									Request date:{" "}
									{format(new Date(request.createdAt), "MMM d, yyyy")}
								</p>
							</CardHeader>
							<CardContent className="pt-4">
								<div className="space-y-3">
									<div className="flex items-start">
										<FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-gray-700">
												Symptoms
											</p>
											<p className="text-sm text-gray-600">
												{request.symptoms}
											</p>
										</div>
									</div>

									<Button
										className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
										onClick={() => handleScheduleAppointment(request)}
									>
										<Calendar className="mr-2 h-4 w-4" />
										Schedule Appointment
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Appointment Scheduling Dialog */}
			<Dialog open={schedulingOpen} onOpenChange={setSchedulingOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Schedule Appointment</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="flex items-center space-x-2">
							<User className="h-5 w-5 text-gray-500" />
							<span className="font-medium">
								{selectedRequest?.userId.fullName}
							</span>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Select Date
							</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left font-normal"
									>
										<Calendar className="mr-2 h-4 w-4" />
										{selectedDate
											? format(selectedDate, "PPP")
											: "Select a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<CalendarComponent
										mode="single"
										selected={selectedDate}
										onSelect={setSelectedDate}
										initialFocus
										disabled={(date) =>
											date < new Date(new Date().setHours(0, 0, 0, 0)) ||
											date.getDay() === 0 ||
											date.getDay() === 6
										}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Select Time
							</label>
							<Select value={selectedTime} onValueChange={setSelectedTime}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a time" />
								</SelectTrigger>
								<SelectContent>
									{timeSlots.map((time) => (
										<SelectItem key={time} value={time}>
											{time.substring(0, 2)}:{time.substring(2, 4)}{" "}
											{Number.parseInt(time) < 12 ? "AM" : "PM"}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Appointment Type
							</label>
							<Select
								value={appointmentType}
								onValueChange={setAppointmentType}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select appointment type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="in-person">In-Person</SelectItem>
									<SelectItem value="virtual">Virtual (Telehealth)</SelectItem>
									<SelectItem value="phone">Phone Consultation</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Notes (Optional)
							</label>
							<Textarea
								placeholder="Add any notes or instructions for the patient"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="min-h-[100px]"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setSchedulingOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSubmitAppointment}
							disabled={!selectedDate || !selectedTime || submitting}
							className="bg-blue-600 hover:bg-blue-700"
						>
							{submitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Scheduling...
								</>
							) : (
								"Schedule Appointment"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default withRoleAccess(AppointmentRequestPage, ["doctor"]);
