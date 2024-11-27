"use client";

import PatientData from "@/components/patientDashboard/PatientData";
import { HealthMetricsGrid } from "@/components/patientDashboard/HealthMetricChart";
import { UpcomingAppointments } from "@/components/patientDashboard/UpcomingAppointment";
import { HealthReminders } from "@/components/patientDashboard/HealthReminder";
import { MedicationSchedule } from "@/components/patientDashboard/MedicationSchedule";
import { HealthGoalsProgress } from "@/components/patientDashboard/HealthGoalProgress";
import { RecentTestResults } from "@/components/patientDashboard/RecentTestResult";
import { sampleDashboardData } from "@/data/sampleDashboardData";
import { withRoleAccess } from "@/components/withRoleAccess";

function DashboardPage() {
	return (
		<div className="flex-col md:flex dashboard-text dashboard-main-bg w-full">
			<PatientData />
			<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-6">
				<div className="col-span-full">
					<HealthMetricsGrid />
				</div>
				<UpcomingAppointments appointments={sampleDashboardData.appointments} />
				<MedicationSchedule medications={sampleDashboardData.medications} />
				<HealthReminders reminders={sampleDashboardData.reminders} />
				<HealthGoalsProgress goals={sampleDashboardData.healthGoals} />
				<div className="col-span-full">
					<RecentTestResults results={sampleDashboardData.testResults} />
				</div>
			</div>
		</div>
	);
}

export default withRoleAccess(DashboardPage, ["patient"]);
