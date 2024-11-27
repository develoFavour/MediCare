"use client";

import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";

function DoctorDashboard() {
	const { userData } = useUser();

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
			<p>Welcome, Dr. {userData?.fullName}!</p>
			{/* Add doctor-specific dashboard content here */}
		</div>
	);
}

export default withRoleAccess(DoctorDashboard, ["doctor"]);
