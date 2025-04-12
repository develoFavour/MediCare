"use client";

import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
	appointments: Array<{
		_id: string;
		status: "scheduled" | "canceled";
	}>;
}

interface PatientTableProps {
	patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
	const router = useRouter();

	const getAssignmentStatus = (patient: Patient) => {
		if (patient.assignedDoctor?.fullName) {
			return `Assigned to Dr. ${patient.assignedDoctor.fullName}`;
		}
		if (patient.appointments.every((apt) => apt.status === "canceled")) {
			return "Appointment Canceled";
		}
		return "Yet to be Assigned";
	};

	const getAssignmentStatusBadge = (patient: Patient) => {
		if (patient.assignedDoctor?.fullName) {
			return (
				<Badge
					variant="outline"
					className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
				>
					<CheckCircle className="h-3 w-3" />
					{`Dr. ${patient.assignedDoctor.fullName}`}
				</Badge>
			);
		}
		if (patient.appointments.every((apt) => apt.status === "canceled")) {
			return (
				<Badge
					variant="outline"
					className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800 flex items-center gap-1"
				>
					<XCircle className="h-3 w-3" />
					Appointment Canceled
				</Badge>
			);
		}
		return (
			<Badge
				variant="outline"
				className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800 flex items-center gap-1"
			>
				<AlertCircle className="h-3 w-3" />
				Not Assigned
			</Badge>
		);
	};

	const getApprovalBadge = (isApproved: boolean) => {
		if (isApproved) {
			return (
				<Badge
					variant="outline"
					className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
				>
					<CheckCircle className="h-3 w-3" />
					Approved
				</Badge>
			);
		}
		return (
			<Badge
				variant="outline"
				className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800 flex items-center gap-1"
			>
				<AlertCircle className="h-3 w-3" />
				Not Approved
			</Badge>
		);
	};

	return (
		<div className="rounded-md border overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Patient</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Approval Status</TableHead>
						<TableHead>Assignment Status</TableHead>
						<TableHead>Appointments</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{patients.map((patient) => (
						<TableRow
							key={patient._id}
							className="cursor-pointer hover:bg-muted/50"
							onClick={() =>
								router.push(`/admin/dashboard/patients/${patient._id}`)
							}
						>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar className="h-9 w-9">
										<AvatarImage
											src={`/placeholder.svg?height=36&width=36`}
											alt={patient.fullName}
										/>
										<AvatarFallback>
											{patient.fullName.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="font-medium">{patient.fullName}</div>
								</div>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{patient.email}
							</TableCell>
							<TableCell>{getApprovalBadge(patient.isApproved)}</TableCell>
							<TableCell>{getAssignmentStatusBadge(patient)}</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									{patient.appointments.length > 0 ? (
										<span>{patient.appointments.length} Appointments</span>
									) : (
										<span className="text-muted-foreground">
											No appointments
										</span>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
