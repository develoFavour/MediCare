"use client";

import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";

interface Patient {
	_id: string;
	fullName: string;
	email: string;
	isApproved: boolean;
	assignedDoctor: {
		_id: string;
		fullName: string;
		specialty: string;
	} | null;
	appointments: Appointment[];
}

interface Appointment {
	_id: string;
	doctorId: {
		_id: string;
		fullName: string;
		specialty: string;
	};
	date: string;
	reason: string;
	status: "scheduled" | "canceled";
}

const PatientsPage = () => {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		fetchPatients();
	}, []);

	const fetchPatients = async () => {
		try {
			const response = await fetch("/api/patients");
			if (response.ok) {
				const data = await response.json();
				setPatients(data);
			} else {
				console.error("Failed to fetch patients:", await response.text());
				toast.error("Failed to fetch patients");
			}
		} catch (error) {
			console.error("Error fetching patients:", error);
			toast.error("An error occurred while fetching patients");
		} finally {
			setLoading(false);
		}
	};

	const getAssignmentStatus = (patient: Patient) => {
		if (patient.assignedDoctor?.fullName) {
			return `Assigned to Dr. ${patient.assignedDoctor.fullName}`;
		}
		if (patient.appointments.every((apt) => apt.status === "canceled")) {
			return "Appointment Canceled";
		}
		return "Yet to be Assigned";
	};

	if (loading) {
		return <LoadingState />;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Patients Management</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Approval Status</TableHead>
						<TableHead>Assignment Status</TableHead>
						<TableHead>Number Of Appointments</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{patients.map((patient) => (
						<TableRow
							key={patient._id}
							className="cursor-pointer"
							onClick={() =>
								router.push(`/admin/dashboard/patients/${patient._id}`)
							}
						>
							<TableCell>{patient.fullName}</TableCell>
							<TableCell>{patient.email}</TableCell>
							<TableCell>
								{patient.isApproved ? "Approved" : "Not Approved"}
							</TableCell>
							<TableCell>{getAssignmentStatus(patient)}</TableCell>
							<TableCell>
								{patient.appointments.length > 0 ? (
									<span>{patient.appointments.length} Booked Appointments</span>
								) : (
									"No appointments"
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default PatientsPage;
