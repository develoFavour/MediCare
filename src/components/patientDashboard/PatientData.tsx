import React from "react";
import {
	CircleUserRound,
	Users,
	Calendar,
	Droplets,
	ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/context/UserContext";

interface TimeFilterOption {
	label: string;
	value: string;
}

const timeFilters: TimeFilterOption[] = [
	{ label: "Today", value: "today" },
	{ label: "7d", value: "7d" },
	{ label: "2w", value: "2w" },
	{ label: "1m", value: "1m" },
	{ label: "3m", value: "3m" },
	{ label: "6m", value: "6m" },
	{ label: "1y", value: "1y" },
];

interface InfoCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	sublabel: string;
}

const InfoCard = ({ icon, label, value, sublabel }: InfoCardProps) => (
	<div className="flex items-center gap-4 p-4 rounded-xl">
		<div className="relative">
			<div className="absolute inset-0 bg-[#116aef] rounded-full opacity-10 animate-pulse"></div>
			<div className="bg-[#116aef] w-12 h-12 sm:w-16 sm:h-16 rounded-full grid place-items-center text-white relative">
				{icon}
			</div>
		</div>
		<div className="flex flex-col">
			<h2 className="text-base sm:text-[1.35rem] mb-1 text-gray-900 font-semibold">
				{value}
			</h2>
			<span className="text-xs sm:text-sm text-gray-500 font-medium">
				{sublabel}
			</span>
		</div>
	</div>
);

const PatientData = () => {
	const [selectedFilter, setSelectedFilter] = React.useState("today");
	const { userData } = useUser();

	const fullName = userData?.fullName ?? "N/A";
	const gender = userData?.gender ?? "N/A";
	const age = userData?.age ?? 0;
	const bloodType = userData?.bloodType ?? "N/A";

	return (
		<div className="space-y-4 sm:space-y-8">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center app-hero-header bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
				<div className="flex items-center gap-2 text-sm mb-4 sm:mb-0">
					<span className="text-gray-500">Home</span>
					<ChevronRight className="w-4 h-4 text-gray-400" />
					<span className="text-[#116aef]">Patients Dashboard</span>
				</div>
				<div className="flex flex-wrap gap-2 bg-gray-50 p-1 rounded-xl">
					{timeFilters.map((filter) => (
						<button
							key={filter.value}
							onClick={() => setSelectedFilter(filter.value)}
							className={cn(
								"px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200",
								selectedFilter === filter.value
									? "bg-[#116aef] text-white shadow-md"
									: "bg-transparent text-gray-600 hover:bg-gray-100"
							)}
						>
							{filter.label}
						</button>
					))}
				</div>
			</div>

			<div className="relative">
				<div className="relative bg-white shadow-lg rounded-[1rem] p-4 sm:p-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						<InfoCard
							icon={<CircleUserRound className="h-5 w-5 sm:h-7 sm:w-7" />}
							label="Patient Name"
							value={fullName}
							sublabel="Patient Name"
						/>
						<InfoCard
							icon={<Users className="h-5 w-5 sm:h-7 sm:w-7" />}
							label="Gender"
							value={gender}
							sublabel="Gender"
						/>
						<InfoCard
							icon={<Calendar className="h-5 w-5 sm:h-7 sm:w-7" />}
							label="Age"
							value={age.toString()}
							sublabel="Patient Age"
						/>
						<InfoCard
							icon={<Droplets className="h-5 w-5 sm:h-7 sm:w-7" />}
							label="Blood Type"
							value={bloodType || "O+"}
							sublabel="Blood Type"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientData;
