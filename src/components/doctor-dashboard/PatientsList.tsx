"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Calendar, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function PatientsList() {
	const router = useRouter();
	const { userData } = useUser();
	const [patients, setPatients] = useState<any[]>([]);
	const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				setLoading(true);

				if (!userData?._id) return;

				// This would be replaced with an actual API call to get patients
				// For now, we'll extract unique patients from appointments
				const response = await fetch(
					`/api/appointments?doctorId=${userData._id}`
				);
				if (!response.ok) throw new Error("Failed to fetch appointments");

				const data = await response.json();
				const appointments = data.appointments || [];

				// Extract unique patients from appointments
				const uniquePatients = Array.from(
					new Map(
						appointments
							.filter((apt: any) => apt.userId && apt.userId._id)
							.map((apt: any) => [apt.userId._id, apt.userId])
					).values()
				);

				setPatients(uniquePatients);
				setFilteredPatients(uniquePatients);
			} catch (error) {
				console.error("Error fetching patients:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPatients();
	}, [userData]);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredPatients(patients);
		} else {
			const query = searchQuery.toLowerCase();
			const filtered = patients.filter(
				(patient) =>
					patient.fullName?.toLowerCase().includes(query) ||
					patient.email?.toLowerCase().includes(query)
			);
			setFilteredPatients(filtered);
		}
	}, [searchQuery, patients]);

	const handleMessagePatient = (patientId: string) => {
		// Navigate to messages with this patient
		router.push(`/messages?participantId=${patientId}`);
	};

	const handleViewAppointments = (patientId: string) => {
		// Navigate to patient appointments
		router.push(`/doctor/patients/${patientId}/appointments`);
	};

	const handleViewRecords = (patientId: string) => {
		// Navigate to patient medical records
		router.push(`/doctor/patients/${patientId}/records`);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Your Patients</CardTitle>
				<div className="relative w-full max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						type="search"
						placeholder="Search patients..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[200px]" />
									<Skeleton className="h-4 w-[160px]" />
								</div>
							</div>
						))}
					</div>
				) : filteredPatients.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						{searchQuery
							? "No patients match your search"
							: "No patients found"}
					</div>
				) : (
					<ScrollArea className="h-[500px] pr-4">
						<div className="space-y-4">
							{filteredPatients.map((patient) => (
								<div
									key={patient._id}
									className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={patient.profileImage || "/placeholder.svg"}
												alt={patient.fullName}
											/>
											<AvatarFallback>
												{patient.fullName
													?.split(" ")
													.map((n: string) => n[0])
													.join("")
													.toUpperCase() || "P"}
											</AvatarFallback>
										</Avatar>
										<div>
											<h4 className="font-medium">{patient.fullName}</h4>
											<p className="text-sm text-gray-500">{patient.email}</p>
										</div>
									</div>
									<div className="flex items-center gap-2 self-end sm:self-center">
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleMessagePatient(patient._id)}
											title="Message patient"
										>
											<MessageSquare className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleViewAppointments(patient._id)}
											title="View appointments"
										>
											<Calendar className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleViewRecords(patient._id)}
											title="View medical records"
										>
											<FileText className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
