"use client";

import { CalendarClock, Users, Stethoscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import BreadCrumb from "./BreadCrumb";

interface DashboardHeaderProps {
	userName: string;
	appointments?: number;
	surgeries?: number;
	meetings?: number;
}

export default function DashboardHeader({
	userName,
	appointments = 9,
	surgeries = 3,
	meetings = 3,
}: DashboardHeaderProps) {
	const checkTimeOfDay = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	return (
		<div className="mb-6 min-h-[230px] rounded-lg overflow-hidden">
			<div className="mb-2">
				<BreadCrumb />
			</div>
			<div className="relative admin-bg py-6 px-6 text-white">
				{/* Content */}
				<div className="relative z-10">
					<h1 className="text-3xl font-bold mb-2">{checkTimeOfDay()}</h1>
					<p className="text-xl mb-6">Dr. {userName}</p>

					<p className="text-lg mb-4">Your schedule today:</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
						{/* Appointments */}
						<div className=" border-none p-4 flex items-center space-x-4">
							<div className="h-12 w-12 rounded bg-cyan-400 shadow-lg flex items-center justify-center">
								<CalendarClock className="h-6 w-6 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold">{appointments}</p>
								<p className="text-sm text-white/90">Appointments</p>
							</div>
						</div>

						{/* Meetings */}
						<Card className="border-none p-4 flex items-center space-x-4">
							<div className="h-12 w-12 rounded bg-violet-400 shadow-lg   flex items-center justify-center">
								<Users className="h-6 w-6 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold">{meetings}</p>
								<p className="text-sm text-white/90">Meetings</p>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
