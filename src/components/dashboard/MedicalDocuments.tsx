"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Calendar, Search, Eye, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { format } from "date-fns";
import { Toaster, toast } from "react-hot-toast";

interface Medication {
	id: string;
	name: string;
	dosage: string;
	frequency: string;
	duration: string;
	instructions: string;
}

interface Prescription {
	_id: string;
	appointmentId: string;
	patientId: string;
	doctorId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
		specialization?: string;
	};
	diagnosis: string;
	symptoms: string;
	medications: Medication[];
	additionalNotes: string;
	status: "draft" | "issued";
	createdAt: string;
	updatedAt: string;
}

export function MedicalDocuments() {
	const { userData } = useUser();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchPrescriptions = async () => {
			try {
				setLoading(true);
				setError(null);

				if (!userData?._id) return;

				const response = await fetch(
					`/api/prescriptions?patientId=${userData._id}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch prescriptions");
				}

				const data = await response.json();
				// Filter to only show issued prescriptions
				const issuedPrescriptions = (data.prescriptions || []).filter(
					(p: Prescription) => p.status === "issued"
				);
				setPrescriptions(issuedPrescriptions);
			} catch (err: any) {
				console.error("Error fetching prescriptions:", err);
				setError(err.message || "Failed to load prescriptions");
			} finally {
				setLoading(false);
			}
		};

		if (userData?._id) {
			fetchPrescriptions();
		}
	}, [userData]);

	// Filter prescriptions by search term
	const filteredPrescriptions = prescriptions.filter((prescription) => {
		return (
			searchTerm === "" ||
			prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
			prescription.doctorId.fullName
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			prescription.medications.some((med) =>
				med.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	});

	const handleView = (prescriptionId: string) => {
		router.push(`/patient/dashboard/prescriptions/${prescriptionId}`);
	};

	const handleDownload = (prescriptionId: string) => {
		// Open the prescription view in a new tab for printing
		window.open(`/patient/dashboard/prescriptions/${prescriptionId}`, "_blank");
		toast.success("Prescription opened in new tab for printing");
	};

	// Helper function to get a summary of medications
	const getMedicationSummary = (medications: Medication[]) => {
		if (medications.length === 0) return "No medications";
		if (medications.length === 1)
			return `${medications[0].name} ${medications[0].dosage}`;
		return `${medications[0].name} and ${medications.length - 1} more`;
	};

	return (
		<>
			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Search prescriptions..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			{loading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="p-4 bg-gray-50 rounded-lg">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
								<div className="space-y-2 w-full sm:w-2/3">
									<Skeleton className="h-5 w-full max-w-[250px]" />
									<div className="flex gap-2">
										<Skeleton className="h-5 w-20" />
										<Skeleton className="h-5 w-24" />
									</div>
									<Skeleton className="h-4 w-full max-w-[200px]" />
								</div>
								<div className="flex gap-2 mt-3 sm:mt-0">
									<Skeleton className="h-9 w-20" />
									<Skeleton className="h-9 w-24" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : error ? (
				<div className="text-center text-red-500 py-4">
					{error}. Please try refreshing the page.
				</div>
			) : filteredPrescriptions.length === 0 ? (
				<div className="text-center text-gray-500 py-8">
					<p className="mb-4">No prescriptions found.</p>
					{searchTerm ? (
						<p>Try changing your search term.</p>
					) : (
						<p>
							Your prescriptions will appear here once they are issued by your
							doctor.
						</p>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{filteredPrescriptions.map((prescription) => (
						<div key={prescription._id} className="p-4 bg-gray-50 rounded-lg">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
								<div>
									<div className="flex items-center">
										<Pill className="h-4 w-4 mr-2 text-primary" />
										<h3 className="font-medium text-gray-900">
											{prescription.diagnosis.length > 40
												? `${prescription.diagnosis.substring(0, 40)}...`
												: prescription.diagnosis}
										</h3>
									</div>
									<div className="flex flex-wrap gap-2 mt-1">
										<Badge
											variant="outline"
											className="bg-blue-100 text-blue-800 border-blue-200"
										>
											Prescription
										</Badge>
										<div className="flex items-center text-xs text-gray-500">
											<Calendar className="h-3 w-3 mr-1" />
											{format(new Date(prescription.createdAt), "MMM d, yyyy")}
										</div>
									</div>
									<p className="text-sm text-gray-600 mt-1">
										Dr. {prescription.doctorId.fullName}
										{prescription.doctorId.specialization &&
											` (${prescription.doctorId.specialization})`}
									</p>
									<p className="text-sm text-gray-600 mt-1">
										Medications:{" "}
										{getMedicationSummary(prescription.medications)}
									</p>
								</div>
								<div className="flex gap-2 mt-3 sm:mt-0">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleView(prescription._id)}
									>
										<Eye className="mr-2 h-4 w-4" />
										View
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDownload(prescription._id)}
									>
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			<Toaster position="top-center" />
		</>
	);
}
