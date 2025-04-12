"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Calendar, Clock, FileText } from "lucide-react";
import { usePatientDetails } from "@/hooks/usePatientDetails";
import { PatientInfo } from "./PatientInfo";
import { UpcomingAppointments } from "./UpcomingAppointments";
import { PastAppointments } from "./PastAppointments";
import { PatientMedicalRecords } from "./PatientMedicalRecords";
import LoadingState from "@/components/LoadingState";

interface PatientDetailsProps {
	patientId: string;
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
	const router = useRouter();
	const {
		patient,
		doctors,
		loading,
		error,
		handleApprove,
		handleAssignDoctor,
		handleCancelAppointment,
	} = usePatientDetails(patientId);
	const [activeTab, setActiveTab] = useState("info");

	if (loading) {
		return <LoadingState />;
	}

	if (error) {
		return (
			<div className="p-8 text-center">
				<div className="inline-block p-4 bg-red-50 dark:bg-red-900 rounded-full mb-4">
					<div className="text-red-500 dark:text-red-300 text-4xl">!</div>
				</div>
				<h2 className="text-xl font-bold mb-2">Error Loading Patient</h2>
				<p className="text-muted-foreground mb-4">{error}</p>
				<Button onClick={() => router.back()}>Go Back</Button>
			</div>
		);
	}

	if (!patient) {
		return (
			<div className="p-8 text-center">
				<h2 className="text-xl font-bold mb-2">Patient Not Found</h2>
				<p className="text-muted-foreground mb-4">
					The requested patient could not be found.
				</p>
				<Button onClick={() => router.back()}>Go Back</Button>
			</div>
		);
	}

	const currentDate = new Date();
	const currentAppointments = patient.appointments.filter(
		(apt) => apt.status === "scheduled" && new Date(apt.date) >= currentDate
	);
	const pastAppointments = patient.appointments.filter(
		(apt) => apt.status === "canceled" || new Date(apt.date) < currentDate
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" onClick={() => router.back()}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold">{patient.fullName}</h1>
					<p className="text-muted-foreground">{patient.email}</p>
				</div>
			</div>

			<GlassCard>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<div className="border-b px-4">
						<TabsList className="h-12">
							<TabsTrigger value="info" className="flex items-center gap-2">
								<User className="h-4 w-4" />
								Patient Info
							</TabsTrigger>
							<TabsTrigger value="upcoming" className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								Upcoming Appointments
							</TabsTrigger>
							<TabsTrigger value="past" className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Past Appointments
							</TabsTrigger>
							<TabsTrigger value="records" className="flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Medical Records
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="info" className="p-4">
						<PatientInfo
							patient={patient}
							doctors={doctors}
							onApprove={handleApprove}
							onAssignDoctor={handleAssignDoctor}
						/>
					</TabsContent>

					<TabsContent value="upcoming" className="p-4">
						<UpcomingAppointments
							appointments={currentAppointments}
							onCancelAppointment={handleCancelAppointment}
						/>
					</TabsContent>

					<TabsContent value="past" className="p-4">
						<PastAppointments appointments={pastAppointments} />
					</TabsContent>

					<TabsContent value="records" className="p-4">
						<PatientMedicalRecords patientId={patient._id} />
					</TabsContent>
				</Tabs>
			</GlassCard>
		</div>
	);
}
