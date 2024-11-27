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
		return <div>Loading...</div>;
	}

	if (!userData || userData.role !== "admin") {
		return null;
	}

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/users/logout");
			const data = await response.json();

			if (data.success) {
				toast.success("Logged out successfully");
				router.push("/login");
			} else {
				toast.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("An error occurred during logout");
		}
	};

	const checkTimeOfTheDay = () => {
		const currentTime = new Date().getHours();
		if (currentTime >= 6 && currentTime < 12) {
			return `Good Morning!`;
		} else if (currentTime >= 12 && currentTime < 18) {
			return `Good Afternoon!`;
		} else {
			return `Good Evening!`;
		}
	};

	const scheduleForToday = [
		{ time: "09:00 AM", task: "Morning Rounds", department: "General" },
		{ time: "10:30 AM", task: "Staff Meeting", department: "Administration" },
		{ time: "01:00 PM", task: "Budget Review", department: "Finance" },
		{
			time: "03:00 PM",
			task: "Patient Complaints Review",
			department: "Patient Relations",
		},
		{
			time: "04:30 PM",
			task: "Department Heads Meeting",
			department: "All Departments",
		},
	];

	const adminRoles = [
		"Hospital Operations Oversight",
		"Financial Management",
		"Staff Coordination",
		"Quality Assurance",
		"Regulatory Compliance",
		"Strategic Planning",
		"Community Relations",
	];

	return (
		<div className="container mx-auto p-6">
			<DashboardHeader userName={userData.fullName} />
		</div>
	);
}

export default withRoleAccess(AdminDashboard, ["admin"]);
