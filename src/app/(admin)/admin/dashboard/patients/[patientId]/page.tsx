"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { CalendarX2, Clock } from "lucide-react";
import { format } from "date-fns";
import LoadingState from "@/components/LoadingState";

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
	email: string;
	age: number;
	gender: string;
}

interface Appointment {
	_id: string;
	doctorId: Doctor | null;
	date: string;
	reason: string;
	status: "scheduled" | "canceled";
}

interface Patient {
	_id: string;
	fullName: string;
	email: string;
	isApproved: boolean;
	assignedDoctor: Doctor | null;
	appointments: Appointment[];
}

const PatientDetails = ({ params }: { params: { patientId: string } }) => {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const fetchPatientDetails = useCallback(async () => {
		try {
			const response = await fetch(`/api/patients/${params.patientId}`);
			if (response.ok) {
				const data = await response.json();
				setPatient(data);
			} else {
				const errorData = await response.json();
				toast.error("Failed to fetch patient details");
			}
		} catch (error) {
			toast.error("An error occurred while fetching patient details");
		} finally {
			setLoading(false);
		}
	}, [params.patientId]);
	const fetchDoctors = async () => {
		try {
			const response = await fetch("/api/doctors/get-doctors-list");
			if (response.ok) {
				const data = await response.json();
				setDoctors(data);
			} else {
				toast.error("Failed to fetch doctors");
			}
		} catch (error) {
			toast.error("An error occurred while fetching doctors");
		}
	};

	useEffect(() => {
		fetchPatientDetails();
		fetchDoctors();
	}, [fetchPatientDetails]);

	const handleApprove = async (approved: boolean) => {
		try {
			const response = await fetch(`/api/patients/${params.patientId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ approved }),
			});

			if (response.ok) {
				toast.success(
					`Patient ${approved ? "approved" : "unapproved"} successfully`
				);
				fetchPatientDetails();
			} else {
				toast.error("Failed to update patient approval status");
			}
		} catch (error) {
			toast.error("An error occurred while updating patient approval status");
		}
	};

	const handleAssignDoctor = async (doctorId: string) => {
		try {
			const response = await fetch(`/api/patients/${params.patientId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ doctorId }),
			});

			if (response.ok) {
				toast.success("Doctor assigned successfully");
				fetchPatientDetails();
			} else {
				toast.error("Failed to assign doctor");
			}
		} catch (error) {
			toast.error("An error occurred while assigning doctor");
		}
	};

	const handleCancelAppointment = async (appointmentId: string) => {
		try {
			const response = await fetch(`/api/appointments/${appointmentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "canceled" }),
			});

			if (response.ok) {
				toast.success("Appointment canceled successfully");
				fetchPatientDetails();
			} else {
				toast.error("Failed to cancel appointment");
			}
		} catch (error) {
			toast.error("An error occurred while canceling the appointment");
		}
	};

	if (loading) {
		return <LoadingState />;
	}

	if (!patient) {
		return <div>Patient not found</div>;
	}

	const currentDate = new Date();
	const currentAppointments = patient.appointments.filter(
		(apt) => apt.status === "scheduled" && new Date(apt.date) >= currentDate
	);
	const pastAppointments = patient.appointments.filter(
		(apt) => apt.status === "canceled" || new Date(apt.date) < currentDate
	);

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Button onClick={() => router.back()} className="mb-4">
				Back to Patients List
			</Button>

			{/* Patient Information Card */}
			<Card>
				<CardHeader>
					<CardTitle>{patient.fullName}</CardTitle>
					<CardDescription>{patient.email}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<strong>Approval Status:</strong>{" "}
							{patient.isApproved ? "Approved" : "Not Approved"}
						</div>
						<Button
							onClick={() => handleApprove(!patient.isApproved)}
							variant={patient.isApproved ? "destructive" : "default"}
						>
							{patient.isApproved ? "Unapprove" : "Approve"}
						</Button>
					</div>

					<div className="space-y-2">
						<strong>Assigned Doctor</strong>
						<Select
							value={patient.assignedDoctor?._id || ""}
							onValueChange={handleAssignDoctor}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a doctor to assign" />
							</SelectTrigger>
							<SelectContent>
								{doctors.map((doctor) => (
									<SelectItem key={doctor._id} value={doctor._id}>
										Dr. {doctor.fullName} - {doctor.specialty}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{patient.assignedDoctor && (
							<p className="text-sm text-muted-foreground">
								Currently assigned to: Dr. {patient.assignedDoctor.fullName} -{" "}
								{patient.assignedDoctor.specialty}
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Current Appointments Card */}
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Appointments</CardTitle>
					<CardDescription>
						Scheduled appointments that have not yet occurred
					</CardDescription>
				</CardHeader>
				<CardContent>
					{currentAppointments.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Doctor</TableHead>
									<TableHead>Reason</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentAppointments.map((appointment) => (
									<TableRow key={appointment._id}>
										<TableCell>
											{format(new Date(appointment.date), "PPP")}
										</TableCell>
										<TableCell>
											{appointment.doctorId
												? `Dr. ${appointment.doctorId.fullName} - ${appointment.doctorId.specialty}`
												: "Doctor information not available"}
										</TableCell>
										<TableCell>{appointment.reason}</TableCell>
										<TableCell>
											<Button
												onClick={() => handleCancelAppointment(appointment._id)}
												variant="destructive"
												size="sm"
											>
												Cancel
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<CalendarX2 className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-lg font-medium">No Upcoming Appointments</p>
							<p className="text-sm text-muted-foreground">
								This patient has no scheduled future appointments.
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Past Appointments Card */}
			<Card>
				<CardHeader>
					<CardTitle>Past Appointments</CardTitle>
					<CardDescription>Completed or canceled appointments</CardDescription>
				</CardHeader>
				<CardContent>
					{pastAppointments.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Doctor</TableHead>
									<TableHead>Reason</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pastAppointments.map((appointment) => (
									<TableRow key={appointment._id}>
										<TableCell>
											{format(new Date(appointment.date), "PPP")}
										</TableCell>
										<TableCell>
											{appointment.doctorId
												? `Dr. ${appointment.doctorId.fullName} - ${appointment.doctorId.specialty}`
												: "Doctor information not available"}
										</TableCell>
										<TableCell>{appointment.reason}</TableCell>
										<TableCell>
											<span
												className={
													appointment.status === "canceled"
														? "text-destructive"
														: "text-muted-foreground"
												}
											>
												{appointment.status === "canceled"
													? "Canceled"
													: "Completed"}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Clock className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-lg font-medium">No Past Appointments</p>
							<p className="text-sm text-muted-foreground">
								There are no completed or canceled appointments in the history.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default PatientDetails;
