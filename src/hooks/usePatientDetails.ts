"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

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

export function usePatientDetails(patientId: string) {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPatientDetails = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/patients/${patientId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch patient details: ${response.status}`);
			}

			const data = await response.json();
			setPatient(data);
		} catch (err) {
			console.error("Error fetching patient details:", err);
			setError(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
			toast.error("Failed to load patient details");
		} finally {
			setLoading(false);
		}
	}, [patientId]);

	const fetchDoctors = async () => {
		try {
			const response = await fetch("/api/doctors/get-doctors-list");

			if (!response.ok) {
				throw new Error(`Failed to fetch doctors: ${response.status}`);
			}

			const data = await response.json();
			setDoctors(data);
		} catch (err) {
			console.error("Error fetching doctors:", err);
			toast.error("Failed to load doctors list");
		}
	};

	useEffect(() => {
		fetchPatientDetails();
		fetchDoctors();
	}, [fetchPatientDetails]);

	const handleApprove = async (approved: boolean) => {
		try {
			const response = await fetch(`/api/patients/${patientId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ approved }),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to update patient approval status: ${response.status}`
				);
			}

			toast.success(
				`Patient ${approved ? "approved" : "unapproved"} successfully`
			);
			fetchPatientDetails();
		} catch (err) {
			console.error("Error updating patient approval status:", err);
			toast.error("Failed to update patient approval status");
		}
	};

	const handleAssignDoctor = async (doctorId: string) => {
		try {
			const response = await fetch(`/api/patients/${patientId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ doctorId }),
			});

			if (!response.ok) {
				throw new Error(`Failed to assign doctor: ${response.status}`);
			}

			toast.success("Doctor assigned successfully");
			fetchPatientDetails();
		} catch (err) {
			console.error("Error assigning doctor:", err);
			toast.error("Failed to assign doctor");
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

			if (!response.ok) {
				throw new Error(`Failed to cancel appointment: ${response.status}`);
			}

			toast.success("Appointment canceled successfully");
			fetchPatientDetails();
		} catch (err) {
			console.error("Error canceling appointment:", err);
			toast.error("Failed to cancel appointment");
		}
	};

	return {
		patient,
		doctors,
		loading,
		error,
		handleApprove,
		handleAssignDoctor,
		handleCancelAppointment,
		refetch: fetchPatientDetails,
	};
}
