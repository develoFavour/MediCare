"use client";

import { useUser } from "@/app/context/UserContext";
import AppointmentsOverview from "@/components/doctor-dashboard/AppointmentOverview";
import DashboardHeader from "@/components/doctor-dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/doctor-dashboard/DashboardSkeleton";
import PatientStatistics from "@/components/doctor-dashboard/PatientStatistics";
import PerformanceMetrics from "@/components/doctor-dashboard/PerformanceMetrics";
import QuickActions from "@/components/doctor-dashboard/QuickActions";
import RecentActivities from "@/components/doctor-dashboard/RecentActivities";
import UpcomingAppointments from "@/components/doctor-dashboard/UpcomingAppointments";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Appointment } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { format, isToday, isPast, isFuture } from "date-fns";

function DoctorDashboard() {
	const router = useRouter();
	const { userData } = useUser();
	const [loading, setLoading] = useState(true);

	const [error, setError] = useState<string | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [stats, setStats] = useState({
		totalPatients: 0,
		appointmentsToday: 0,
		completedAppointments: 0,
		pendingAppointments: 0,
		averageRating: 0,
		totalAppointments: 0,
	});

	useEffect(() => {
		// Simulate loading dashboard data
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				setError(null);

				const appointmentData = await fetch(
					`/api/appointments?doctorId=${userData?._id}`
				);
				if (!appointmentData.ok) {
					throw new Error("Failed to fetch appointments");
				}
				const data = await appointmentData.json();
				setAppointments(data.appointments || []);

				const apt = data.appointments.filter((appointment: any) =>
					isToday(new Date(appointment.date))
				);
				const completedAppointments = data.appointments.filter(
					(apt: any) => apt.status === "completed"
				);

				const scheduledAppointments = apt.filter(
					(apt: any) => apt.status === "scheduled"
				);

				setStats({
					...stats,
					// totalPatients: 248,
					appointmentsToday: apt.length,
					completedAppointments: completedAppointments.length,
					pendingAppointments: scheduledAppointments.length,
					averageRating: 4.8,
					totalAppointments: data.appointments.length,
				});
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading) {
		return <DashboardSkeleton />;
	}

	return (
		<div className=" py-6 bg-gray-50 min-h-screen">
			<DashboardHeader userData={userData} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				<div className="lg:col-span-2 space-y-6">
					<AppointmentsOverview
						appointmentsToday={stats.appointmentsToday}
						completedAppointments={stats.completedAppointments}
						pendingAppointments={stats.pendingAppointments}
					/>

					<UpcomingAppointments />

					<RecentActivities />
				</div>

				<div className="space-y-6">
					{/* <QuickActions /> */}

					<PatientStatistics
						totalPatients={stats.totalPatients}
						averageRating={stats.averageRating}
						totalAppointments={stats.totalAppointments}
					/>

					<PerformanceMetrics />
				</div>
			</div>
		</div>
	);
}

export default withRoleAccess(DoctorDashboard, ["doctor"]);
