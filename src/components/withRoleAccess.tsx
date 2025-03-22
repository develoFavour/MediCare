"use client";

import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingState from "./LoadingState";

export function withRoleAccess<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	allowedRoles: string[]
) {
	return function WithRoleAccess(props: P) {
		const { userData, isLoading } = useUser();
		const router = useRouter();

		useEffect(() => {
			if (!isLoading && userData && !allowedRoles.includes(userData.role)) {
				router.push("/login");
			}
		}, [userData, isLoading, router]);

		if (isLoading) {
			return <LoadingState />;
		}

		if (!userData || !allowedRoles.includes(userData.role)) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};
}
