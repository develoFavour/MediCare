"use client";

import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ClipboardList,
	Users,
	Activity,
	LogOut,
	CalendarClock,
} from "lucide-react";
import Image from "next/image";
import DashboardHeader from "@/components/AdminDashboardHeader";
import AvailableDoctors from "@/components/AvailableDoctors";
import UpcomingAppointments from "@/components/UpComingAppointments";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";

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

	const handleLogout = async () => {
		try {
			// Start showing loading state
			toast.loading("Logging out...");

			// Make the request to the logout endpoint
			const response = await fetch("/api/users/logout", {
				method: "GET",
				credentials: "include", // Important to include cookies
			});

			if (response.ok) {
				toast.dismiss();
				toast.success("Logged out successfully");

				// Use window.location for a full page refresh
				window.location.href = "/login";
			} else {
				toast.dismiss();
				toast.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.dismiss();
			toast.error("An error occurred during logout");
		}
	};

	return (
		<div className="container mx-auto p-6">
			<DashboardHeader userName={userData.fullName} />
			<AvailableDoctors />
			<div className="flex-grow container mx-auto px-4 py-4 bg-[#F8FAFC] mt-8">
				<UpcomingAppointments />
			</div>
			<div className="flex justify-end text-[#1565C0]">
				<Button onClick={handleLogout}>
					<LogOut size={24} className="mr-2" />
					Logout
				</Button>
			</div>
			<Footer />
		</div>
	);
}

export default withRoleAccess(AdminDashboard, ["admin"]);
