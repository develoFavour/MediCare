"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CheckCircle,
	XCircle,
	Phone,
	MapPin,
	Calendar,
	User,
} from "lucide-react";

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
}

interface Patient {
	_id: string;
	fullName: string;
	email: string;
	isApproved: boolean;
	assignedDoctor: Doctor | null;
	phone?: string;
	address?: string;
	dateOfBirth?: string;
	gender?: string;
	bloodType?: string;
}

interface PatientInfoProps {
	patient: Patient;
	doctors: Doctor[];
	onApprove: (approved: boolean) => void;
	onAssignDoctor: (doctorId: string) => void;
}

export function PatientInfo({
	patient,
	doctors,
	onApprove,
	onAssignDoctor,
}: PatientInfoProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-1">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Patient Profile</CardTitle>
						<CardDescription>Basic patient information</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<div className="flex flex-col items-center mb-6">
							<Avatar className="h-24 w-24 mb-4">
								<AvatarImage
									src={`/placeholder.svg?height=96&width=96`}
									alt={patient.fullName}
								/>
								<AvatarFallback className="text-2xl">
									{patient.fullName.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<h3 className="text-xl font-bold">{patient.fullName}</h3>
							<p className="text-muted-foreground">{patient.email}</p>
						</div>

						<div className="space-y-4">
							{patient.phone && (
								<div className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span>{patient.phone}</span>
								</div>
							)}

							{patient.address && (
								<div className="flex items-start gap-3">
									<MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
									<span>{patient.address}</span>
								</div>
							)}

							{patient.dateOfBirth && (
								<div className="flex items-center gap-3">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span>
										{new Date(patient.dateOfBirth).toLocaleDateString()}
									</span>
								</div>
							)}

							{patient.gender && (
								<div className="flex items-center gap-3">
									<User className="h-4 w-4 text-muted-foreground" />
									<span>{patient.gender}</span>
								</div>
							)}

							{patient.bloodType && (
								<div className="flex items-center gap-3">
									<Badge
										variant="outline"
										className="h-6 w-6 flex items-center justify-center rounded-full"
									>
										{patient.bloodType}
									</Badge>
									<span>Blood Type</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="md:col-span-2 space-y-6">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Approval Status</CardTitle>
						<CardDescription>Manage patient approval status</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								{patient.isApproved ? (
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800 flex items-center gap-1"
									>
										<CheckCircle className="h-3 w-3" />
										Approved
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800 flex items-center gap-1"
									>
										<XCircle className="h-3 w-3" />
										Not Approved
									</Badge>
								)}
								<span className="text-muted-foreground">
									{patient.isApproved
										? "This patient is approved and can book appointments"
										: "This patient needs approval before booking appointments"}
								</span>
							</div>

							<Button
								onClick={() => onApprove(!patient.isApproved)}
								variant={patient.isApproved ? "destructive" : "default"}
							>
								{patient.isApproved ? "Unapprove" : "Approve"}
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle>Doctor Assignment</CardTitle>
						<CardDescription>Assign a doctor to this patient</CardDescription>
					</CardHeader>
					<CardContent className="pt-4">
						<div className="space-y-4">
							<Select
								value={patient.assignedDoctor?._id || ""}
								onValueChange={onAssignDoctor}
							>
								<SelectTrigger>
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

							{patient.assignedDoctor ? (
								<div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
									<div className="flex items-center gap-3 mb-2">
										<Avatar className="h-10 w-10">
											<AvatarFallback>
												{patient.assignedDoctor.fullName.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div>
											<h4 className="font-medium">
												Dr. {patient.assignedDoctor.fullName}
											</h4>
											<p className="text-sm text-muted-foreground">
												{patient.assignedDoctor.specialty}
											</p>
										</div>
									</div>
									<p className="text-sm text-muted-foreground">
										This patient is currently assigned to Dr.{" "}
										{patient.assignedDoctor.fullName}. You can change the
										assigned doctor using the dropdown above.
									</p>
								</div>
							) : (
								<div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md">
									<p className="text-sm text-muted-foreground">
										This patient is not assigned to any doctor yet. Please
										select a doctor from the dropdown above.
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
