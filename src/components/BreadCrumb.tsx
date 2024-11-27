import { cn } from "@/lib/utils";
import React from "react";

const BreadCrumb = () => {
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
	const [selectedFilter, setSelectedFilter] = React.useState("today");

	return (
		<div className="flex justify-between items-center app-hero-header bg-white p-6 rounded-2xl shadow-sm">
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-500">Home</span>
				<span className="text-gray-400">/</span>
				<span className="text-[#116aef]">Patients Dashboard</span>
			</div>
			<div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
				{timeFilters.map((filter) => (
					<button
						key={filter.value}
						onClick={() => setSelectedFilter(filter.value)}
						className={cn(
							"px-4 py-2 rounded-lg text-sm transition-all duration-200",
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
	);
};

export default BreadCrumb;
