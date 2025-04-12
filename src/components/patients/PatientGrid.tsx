"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Calendar,
	CheckCircle,
	XCircle,
	AlertCircle,
	Mail,
} from "lucide-react";

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

interface PatientGridProps {
	patients: Patient[];
}

export function PatientGrid({ patients }: PatientGridProps) {
	const router = useRouter();

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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{patients.map((patient) => (
				<Card
					key={patient._id}
					className="cursor-pointer hover:shadow-md transition-shadow"
					onClick={() =>
						router.push(`/admin/dashboard/patients/${patient._id}`)
					}
				>
					<CardContent className="pt-6">
						<div className="flex items-center gap-4 mb-4">
							<Avatar className="h-12 w-12">
								<AvatarImage
									src={`/placeholder.svg?height=48&width=48`}
									alt={patient.fullName}
								/>
								<AvatarFallback>{patient.fullName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="font-medium text-lg">{patient.fullName}</h3>
								<div className="flex items-center text-sm text-muted-foreground">
									<Mail className="h-3 w-3 mr-1" />
									{patient.email}
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex flex-wrap gap-2">
								{getApprovalBadge(patient.isApproved)}
								{getAssignmentStatusBadge(patient)}
							</div>

							<div className="flex items-center gap-2 text-sm">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								{patient.appointments.length > 0 ? (
									<span>{patient.appointments.length} Appointments</span>
								) : (
									<span className="text-muted-foreground">No appointments</span>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="bg-muted/50 text-xs text-muted-foreground">
						Click to view patient details
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
