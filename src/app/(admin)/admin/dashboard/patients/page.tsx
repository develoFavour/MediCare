"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import BreadCrumb from "@/components/BreadCrumb";
import { PatientsList } from "@/components/patients/PatientsList";
import { withRoleAccess } from "@/components/withRoleAccess";
import { useUser } from "@/app/context/UserContext";
import LoadingState from "@/components/LoadingState";

function PatientsPage() {
	const { userData, isLoading } = useUser();

	if (isLoading) {
		return <LoadingState />;
	}

	if (!userData) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 p-6 pt-4 overflow-auto">
				<div className="max-w-7xl mx-auto space-y-6">
					<PatientsList />
				</div>
			</main>
		</div>
	);
}

export default withRoleAccess(PatientsPage, ["admin"]);
