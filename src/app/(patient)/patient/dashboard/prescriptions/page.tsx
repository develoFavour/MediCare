"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import {
	Search,
	FileText,
	Calendar,
	Pill,
	Loader2,
	AlertCircle,
	ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
	medications: any[];
	status: "draft" | "issued";
	createdAt: string;
	updatedAt: string;
}

const PatientPrescriptionsPage = () => {
	const router = useRouter();
	const { userData } = useUser();

	const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

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
				setPrescriptions(data.prescriptions || []);
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

	const filteredPrescriptions = prescriptions.filter((prescription) => {
		// Only show issued prescriptions to patients
		if (prescription.status !== "issued") return false;

		// Filter by search query
		return (
			searchQuery === "" ||
			prescription.doctorId.fullName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	const renderPrescriptionCard = (prescription: Prescription) => {
		return (
			<Card
				key={prescription._id}
				className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
				onClick={() =>
					router.push(`/patient/dashboard/prescriptions/${prescription._id}`)
				}
			>
				<CardContent className="p-6">
					<div className="flex justify-between items-start">
						<div className="flex items-center">
							<Avatar className="h-10 w-10 mr-4">
								<AvatarImage
									src={prescription.doctorId.profileImage}
									alt={prescription.doctorId.fullName}
								/>
								<AvatarFallback>
									{prescription.doctorId.fullName
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="font-medium text-gray-900">
									Dr. {prescription.doctorId.fullName}
								</h3>
								<p className="text-sm text-gray-500">
									{prescription.doctorId.specialization || "Physician"}
								</p>
							</div>
						</div>
						<div className="flex items-center">
							<Badge
								variant="outline"
								className="bg-green-100 text-green-800 hover:bg-green-100"
							>
								Issued
							</Badge>
							<ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
						</div>
					</div>

					<Separator className="my-4" />

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-start">
							<FileText className="h-5 w-5 text-gray-400 mr-2" />
							<div>
								<p className="text-xs text-gray-500">Diagnosis</p>
								<p className="text-sm text-gray-700 line-clamp-1">
									{prescription.diagnosis || "No diagnosis"}
								</p>
							</div>
						</div>
						<div className="flex items-start">
							<Pill className="h-5 w-5 text-gray-400 mr-2" />
							<div>
								<p className="text-xs text-gray-500">Medications</p>
								<p className="text-sm text-gray-700">
									{prescription.medications.length} prescribed
								</p>
							</div>
						</div>
						<div className="flex items-start">
							<Calendar className="h-5 w-5 text-gray-400 mr-2" />
							<div>
								<p className="text-xs text-gray-500">Date</p>
								<p className="text-sm text-gray-700">
									{format(new Date(prescription.createdAt), "MMM d, yyyy")}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
					<p className="text-gray-600">View and manage your prescriptions</p>
				</div>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search prescriptions by doctor name or diagnosis..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			) : error ? (
				<Card>
					<CardContent className="py-10">
						<div className="flex flex-col items-center justify-center text-center">
							<AlertCircle className="h-10 w-10 text-red-500 mb-4" />
							<h3 className="text-lg font-medium text-gray-800 mb-2">
								Failed to load prescriptions
							</h3>
							<p className="text-gray-600 mb-4">{error}</p>
							<Button onClick={() => window.location.reload()}>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			) : filteredPrescriptions.length === 0 ? (
				<Card>
					<CardContent className="py-10">
						<div className="flex flex-col items-center justify-center text-center">
							<FileText className="h-10 w-10 text-gray-400 mb-4" />
							<h3 className="text-lg font-medium text-gray-800 mb-2">
								No prescriptions found
							</h3>
							<p className="text-gray-600 mb-4">
								{searchQuery
									? "No prescriptions match your search criteria"
									: "You don't have any prescriptions yet"}
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div>{filteredPrescriptions.map(renderPrescriptionCard)}</div>
			)}
			<Toaster position="top-center" />
		</div>
	);
};

export default withRoleAccess(PatientPrescriptionsPage, ["patient"]);
