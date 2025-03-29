"use client";

import { useState } from "react";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Import dashboard components

import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";

import { PatientProfile } from "@/components/dashboard/PatientProfile";
import { QuickBooking } from "@/components/dashboard/QuickBooking";

import { AppointmentHistory } from "@/components/dashboard/AppointmentHistory";
import { MedicalDocuments } from "@/components/dashboard/MedicalDocuments";

function PatientDashboardPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("overview");

	return (
		<div className="space-y-4 pb-8">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Patient Dashboard
					</h1>
					<div className="flex items-center text-sm text-gray-500 mt-1">
						<span>Home</span>
						<ChevronRight className="h-4 w-4 mx-1" />
						<span className="text-primary">Dashboard</span>
					</div>
				</div>
				<Button
					className="mt-4 sm:mt-0"
					onClick={() => router.push("/patient/dashboard/appointment")}
				>
					<Plus className="mr-2 h-4 w-4" /> Book Appointment
				</Button>
			</div>

			{/* Patient Profile Summary */}
			<PatientProfile />

			{/* Dashboard Tabs */}
			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid grid-cols-3 mb-6">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="appointments">Appointments</TabsTrigger>
					<TabsTrigger value="documents">Medical Documents</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					{/* Quick Booking Section */}
					<QuickBooking />

					{/* Upcoming Appointments & Reminders */}
					<div className="grid gap-6">
						<UpcomingAppointments limit={3} />
					</div>

					{/* Doctor Availability & Hospital Announcements */}
				</TabsContent>

				{/* Appointments Tab */}
				<TabsContent value="appointments" className="space-y-6">
					<AppointmentHistory />
				</TabsContent>

				{/* Medical Documents Tab */}
				<TabsContent value="documents" className="space-y-6">
					<MedicalDocuments />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default withRoleAccess(PatientDashboardPage, ["patient"]);
