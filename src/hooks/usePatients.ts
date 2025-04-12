"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
}

interface Appointment {
	_id: string;
	doctorId: Doctor;
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

export function usePatients() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPatients = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/patients");

			if (!response.ok) {
				throw new Error(`Failed to fetch patients: ${response.status}`);
			}

			const data = await response.json();
			setPatients(data);
		} catch (err) {
			console.error("Error fetching patients:", err);
			setError(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
			toast.error("Failed to load patients");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPatients();
	}, []);

	return {
		patients,
		loading,
		error,
		refetch: fetchPatients,
	};
}
