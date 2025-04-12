"use client";

import { useState, useEffect } from "react";
import { withRoleAccess } from "@/components/withRoleAccess";
import { useUser } from "@/app/context/UserContext";
import { isToday } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Star, CheckCircle } from "lucide-react";

// Import dashboard components
import DashboardHeader from "@/components/doctor-dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/doctor-dashboard/DashboardSkeleton";
import AppointmentsOverview from "@/components/doctor-dashboard/AppointmentOverview";
import UpcomingAppointments from "@/components/doctor-dashboard/UpcomingAppointments";
import RecentActivities from "@/components/doctor-dashboard/RecentActivities";
import PatientStatistics from "@/components/doctor-dashboard/PatientStatistics";
import PerformanceMetrics from "@/components/doctor-dashboard/PerformanceMetrics";
import QuickActions from "@/components/doctor-dashboard/QuickActions";
import PatientsList from "@/components/doctor-dashboard/PatientsList";
import AppointmentCalendar from "@/components/doctor-dashboard/AppointmentCalendar";

function DoctorDashboard() {
	const { userData } = useUser();
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const [error, setError] = useState<string | null>(null);
	const [appointments, setAppointments] = useState<any[]>([]);
	const [stats, setStats] = useState({
		totalPatients: 0,
		appointmentsToday: 0,
		completedAppointments: 0,
		pendingAppointments: 0,
		averageRating: 0,
		totalAppointments: 0,
	});

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				setError(null);

				if (!userData?._id) {
					// Wait for user data to be available
					return;
				}

				const appointmentData = await fetch(
					`/api/appointments?doctorId=${userData._id}`
				);
				if (!appointmentData.ok) {
					throw new Error("Failed to fetch appointments");
				}

				const data = await appointmentData.json();
				const appointmentsList = data.appointments || [];
				setAppointments(appointmentsList);

				// Calculate statistics
				const todayAppointments = appointmentsList.filter((appointment: any) =>
					isToday(new Date(appointment.date))
				);

				const completedAppointments = appointmentsList.filter(
					(apt: any) => apt.status === "completed"
				);

				const scheduledAppointments = appointmentsList.filter(
					(apt: any) => apt.status === "scheduled"
				);

				// Get unique patient count
				const uniquePatientIds = new Set(
					appointmentsList.map((apt: any) => apt.userId?._id || apt.userId)
				);

				setStats({
					totalPatients: uniquePatientIds.size,
					appointmentsToday: todayAppointments.length,
					completedAppointments: completedAppointments.length,
					pendingAppointments: scheduledAppointments.length,
					averageRating: 4.8, // Placeholder - would come from actual ratings
					totalAppointments: appointmentsList.length,
				});
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				setError("Failed to load dashboard data. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [userData]);

	if (loading) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
			<DashboardHeader userData={userData} />

			{/* Quick Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
			>
				<Card className="border-l-4 border-l-blue-500">
					<CardContent className="p-4 flex justify-between items-center">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Today&apos;s Appointments
							</p>
							<p className="text-2xl font-bold">{stats.appointmentsToday}</p>
						</div>
						<Calendar className="h-8 w-8 text-blue-500 opacity-80" />
					</CardContent>
				</Card>

				<Card className="border-l-4 border-l-green-500">
					<CardContent className="p-4 flex justify-between items-center">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Total Patients
							</p>
							<p className="text-2xl font-bold">{stats.totalPatients}</p>
						</div>
						<Users className="h-8 w-8 text-green-500 opacity-80" />
					</CardContent>
				</Card>

				<Card className="border-l-4 border-l-amber-500">
					<CardContent className="p-4 flex justify-between items-center">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
							<p className="text-2xl font-bold">{stats.averageRating}</p>
						</div>
						<Star className="h-8 w-8 text-amber-500 opacity-80" />
					</CardContent>
				</Card>

				<Card className="border-l-4 border-l-purple-500">
					<CardContent className="p-4 flex justify-between items-center">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Completed
							</p>
							<p className="text-2xl font-bold">
								{stats.completedAppointments}
							</p>
						</div>
						<CheckCircle className="h-8 w-8 text-purple-500 opacity-80" />
					</CardContent>
				</Card>
			</motion.div>

			{/* Dashboard Tabs */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="mt-6"
			>
				<Tabs
					defaultValue="overview"
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="grid grid-cols-4 mb-6">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="appointments">Appointments</TabsTrigger>
						<TabsTrigger value="patients">Patients</TabsTrigger>
						<TabsTrigger value="performance">Performance</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								<AppointmentsOverview
									appointmentsToday={stats.appointmentsToday}
									completedAppointments={stats.completedAppointments}
									pendingAppointments={stats.pendingAppointments}
								/>
								<UpcomingAppointments appointments={appointments} />
								<RecentActivities />
							</div>

							<div className="space-y-6">
								<QuickActions />
								<PatientStatistics
									totalPatients={stats.totalPatients}
									averageRating={stats.averageRating}
									totalAppointments={stats.totalAppointments}
								/>
							</div>
						</div>
					</TabsContent>

					{/* Appointments Tab */}
					<TabsContent value="appointments" className="space-y-6">
						<AppointmentCalendar appointments={appointments} />
					</TabsContent>

					{/* Patients Tab */}
					<TabsContent value="patients" className="space-y-6">
						<PatientsList />
					</TabsContent>

					{/* Performance Tab */}
					<TabsContent value="performance" className="space-y-6">
						<PerformanceMetrics />
					</TabsContent>
				</Tabs>
			</motion.div>
		</div>
	);
}

export default withRoleAccess(DoctorDashboard, ["doctor"]);
