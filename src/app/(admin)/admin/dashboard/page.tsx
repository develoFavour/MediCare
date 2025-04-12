"use client";

import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	CalendarClock,
	UserPlus,
	Calendar,
	Stethoscope,
	Clock,
} from "lucide-react";

import LoadingState from "@/components/LoadingState";

import { AppointmentsList } from "@/components/admin/AppointmentsList";
import { DoctorsList } from "@/components/admin/DoctorsList";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCard";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

function AdminDashboard() {
	const { userData, isLoading } = useUser();
	const router = useRouter();
	const [date, setDate] = useState<Date | undefined>(new Date());

	useEffect(() => {
		if (!isLoading && (!userData || userData.role !== "admin")) {
			router.push("/login");
		}
	}, [userData, isLoading, router]);

	if (isLoading) {
		return <LoadingState />;
	}

	if (!userData || userData.role !== "admin") {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 p-6 pt-4 overflow-auto">
				<AdminHeader user={userData} />
				<div className="max-w-7xl mx-auto space-y-6">
					<StatsCards />

					{/* Add the Analytics Dashboard */}
					<AnalyticsDashboard />

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Card className="lg:col-span-2">
							<CardHeader className="pb-2">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg font-semibold text-gray-900">
										Recent Appointments
									</CardTitle>
									<Button variant="outline" size="sm" className="text-primary">
										<Calendar className="h-4 w-4 mr-2" />
										View Calendar
									</Button>
								</div>
								<CardDescription>
									Overview of today&apos;s scheduled appointments
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AppointmentsList />
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-lg font-semibold text-gray-900">
									Activity Timeline
								</CardTitle>
								<CardDescription>Recent system activities</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-start gap-4">
										<div className="mt-1 bg-primary/10 p-2 rounded-full">
											<UserPlus className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="text-sm font-medium">
												New patient registered
											</p>
											<p className="text-xs text-gray-500">
												Sarah Johnson • 35 minutes ago
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="mt-1 bg-green-100 p-2 rounded-full">
											<CalendarClock className="h-4 w-4 text-green-600" />
										</div>
										<div>
											<p className="text-sm font-medium">
												Appointment completed
											</p>
											<p className="text-xs text-gray-500">
												Dr. Williams with John Doe • 1 hour ago
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="mt-1 bg-amber-100 p-2 rounded-full">
											<Clock className="h-4 w-4 text-amber-600" />
										</div>
										<div>
											<p className="text-sm font-medium">
												Appointment rescheduled
											</p>
											<p className="text-xs text-gray-500">
												Michael Brown • 2 hours ago
											</p>
										</div>
									</div>
									<div className="flex items-start gap-4">
										<div className="mt-1 bg-blue-100 p-2 rounded-full">
											<Stethoscope className="h-4 w-4 text-blue-600" />
										</div>
										<div>
											<p className="text-sm font-medium">New doctor added</p>
											<p className="text-xs text-gray-500">
												Dr. Emily Chen • 3 hours ago
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<DoctorsList />
				</div>
			</main>
			<footer className="border-t bg-white dark:bg-gray-900 p-4 text-center text-sm text-gray-500">
				<p>
					© {new Date().getFullYear()} MediCare Admin Dashboard. All rights
					reserved.
				</p>
			</footer>
			<Toaster position="top-right" />
		</div>
	);
}

export default withRoleAccess(AdminDashboard, ["admin"]);
