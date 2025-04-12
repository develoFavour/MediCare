"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FiltersState {
	approvalStatus: string;
	assignmentStatus: string;
}

interface PatientFiltersProps {
	filters: FiltersState;
	setFilters: (filters: FiltersState) => void;
}

export function PatientFilters({ filters, setFilters }: PatientFiltersProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-4">
			<div className="w-full sm:w-auto">
				<label className="block text-sm font-medium text-muted-foreground mb-1">
					Approval Status
				</label>
				<Select
					value={filters.approvalStatus}
					onValueChange={(value) =>
						setFilters({ ...filters, approvalStatus: value })
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Filter by approval" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="not-approved">Not Approved</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="w-full sm:w-auto">
				<label className="block text-sm font-medium text-muted-foreground mb-1">
					Assignment Status
				</label>
				<Select
					value={filters.assignmentStatus}
					onValueChange={(value) =>
						setFilters({ ...filters, assignmentStatus: value })
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Filter by assignment" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Assignments</SelectItem>
						<SelectItem value="assigned">Assigned to Doctor</SelectItem>
						<SelectItem value="unassigned">Not Assigned</SelectItem>
						<SelectItem value="canceled">Appointments Canceled</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
