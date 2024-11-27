"use client";

import React, { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import LoadingDashboard from "./LoadingDashboard";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userData, isLoading, error, fetchUser } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!userData && !isLoading) {
			fetchUser();
		}
	}, [userData, isLoading, fetchUser]);

	useEffect(() => {
		if (!isLoading && userData) {
			switch (userData.role) {
				case "admin":
					router.push("/admin/dashboard");
					break;
				case "doctor":
					router.push("/doctor/dashboard");
					break;
				case "patient":
					router.push("/patient/dashboard");
					break;
				default:
					router.push("/login");
			}
		}
	}, [isLoading, userData, router]);

	if (isLoading) {
		return <LoadingDashboard />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return <>{children}</>;
}
