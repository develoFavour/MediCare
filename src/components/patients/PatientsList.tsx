"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, UserRound } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatients } from "@/hooks/usePatients";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientGrid } from "@/components/patients/PatientGrid";
import { PatientFilters } from "@/components/patients/PatientFilters";
import { EmptyState } from "@/components/ui/empty-state";

export function PatientsList() {
	const router = useRouter();
	const { patients, loading, error } = usePatients();
	const [searchTerm, setSearchTerm] = useState("");
	const [viewMode, setViewMode] = useState<"table" | "grid">("table");
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		approvalStatus: "all",
		assignmentStatus: "all",
	});

	const filteredPatients = useMemo(() => {
		if (!patients) return [];

		return patients.filter((patient) => {
			// Search filter
			const matchesSearch =
				patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				patient.email.toLowerCase().includes(searchTerm.toLowerCase());

			// Approval status filter
			const matchesApproval =
				filters.approvalStatus === "all" ||
				(filters.approvalStatus === "approved" && patient.isApproved) ||
				(filters.approvalStatus === "not-approved" && !patient.isApproved);

			// Assignment status filter
			const hasAssignedDoctor = !!patient.assignedDoctor?.fullName;
			const allAppointmentsCanceled = patient.appointments.every(
				(apt) => apt.status === "canceled"
			);

			let matchesAssignment = filters.assignmentStatus === "all";

			if (filters.assignmentStatus === "assigned" && hasAssignedDoctor) {
				matchesAssignment = true;
			} else if (
				filters.assignmentStatus === "unassigned" &&
				!hasAssignedDoctor
			) {
				matchesAssignment = true;
			} else if (
				filters.assignmentStatus === "canceled" &&
				allAppointmentsCanceled
			) {
				matchesAssignment = true;
			}

			return matchesSearch && matchesApproval && matchesAssignment;
		});
	}, [patients, searchTerm, filters]);

	const patientStats = useMemo(() => {
		if (!patients) return { total: 0, approved: 0, assigned: 0 };

		const approved = patients.filter((p) => p.isApproved).length;
		const assigned = patients.filter((p) => !!p.assignedDoctor).length;

		return {
			total: patients.length,
			approved,
			assigned,
		};
	}, [patients]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold">Patients Management</h1>
					<p className="text-muted-foreground">
						Manage and view all patients in the system
					</p>
				</div>
				<Button
					onClick={() => router.push("/admin/dashboard/patients/add")}
					className="bg-primary hover:bg-primary/90"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add New Patient
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<GlassCard className="p-4">
					<div className="flex items-center gap-3">
						<div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
							<UserRound className="h-6 w-6 text-blue-600 dark:text-blue-300" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Patients</p>
							<p className="text-2xl font-bold">{patientStats.total}</p>
						</div>
					</div>
				</GlassCard>

				<GlassCard className="p-4">
					<div className="flex items-center gap-3">
						<div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
							<Badge className="h-6 w-6 flex items-center justify-center bg-green-600 text-white">
								✓
							</Badge>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Approved</p>
							<p className="text-2xl font-bold">{patientStats.approved}</p>
						</div>
					</div>
				</GlassCard>

				<GlassCard className="p-4">
					<div className="flex items-center gap-3">
						<div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
							<Badge className="h-6 w-6 flex items-center justify-center bg-purple-600 text-white">
								Dr
							</Badge>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								Assigned to Doctor
							</p>
							<p className="text-2xl font-bold">{patientStats.assigned}</p>
						</div>
					</div>
				</GlassCard>
			</div>

			<GlassCard>
				<div className="p-4 border-b">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="relative w-full md:w-auto md:flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search patients by name or email..."
								className="pl-10 w-full"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div className="flex items-center gap-2 w-full md:w-auto">
							<Button
								variant="outline"
								size="icon"
								onClick={() => setShowFilters(!showFilters)}
								className={showFilters ? "bg-muted" : ""}
							>
								<Filter className="h-4 w-4" />
							</Button>

							<Tabs
								defaultValue="table"
								value={viewMode}
								onValueChange={(v) => setViewMode(v as "table" | "grid")}
								className="w-full md:w-auto"
							>
								<TabsList className="grid w-full grid-cols-2">
									<TabsTrigger value="table">Table</TabsTrigger>
									<TabsTrigger value="grid">Grid</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</div>

					{showFilters && (
						<div className="mt-4 pt-4 border-t">
							<PatientFilters filters={filters} setFilters={setFilters} />
						</div>
					)}
				</div>

				<div className="p-4">
					{loading ? (
						<div className="py-8 text-center">
							<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
							<p className="mt-2 text-muted-foreground">Loading patients...</p>
						</div>
					) : error ? (
						<EmptyState
							icon={<div className="text-red-500 text-4xl">!</div>}
							title="Error loading patients"
							description="There was a problem loading the patient list. Please try again."
							action={<Button>Retry</Button>}
						/>
					) : filteredPatients.length === 0 ? (
						<EmptyState
							icon={<UserRound className="h-10 w-10 text-muted-foreground" />}
							title="No patients found"
							description="No patients match your current filters. Try adjusting your search or filters."
							action={
								<Button
									onClick={() => {
										setSearchTerm("");
										setFilters({
											approvalStatus: "all",
											assignmentStatus: "all",
										});
									}}
								>
									Reset Filters
								</Button>
							}
						/>
					) : (
						<Tabs defaultValue="table" value={viewMode}>
							<TabsContent value="table" className="mt-0">
								<PatientTable patients={filteredPatients} />
							</TabsContent>
							<TabsContent value="grid" className="mt-0">
								<PatientGrid patients={filteredPatients} />
							</TabsContent>
						</Tabs>
					)}
				</div>
			</GlassCard>
		</div>
	);
}
