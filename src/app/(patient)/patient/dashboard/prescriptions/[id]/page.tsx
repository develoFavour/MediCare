"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "react-hot-toast";
import { format } from "date-fns";
import {
	ChevronLeft,
	Download,
	Printer,
	Loader2,
	AlertCircle,
	Calendar,
	Pill,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

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
	appointment?: {
		date: string;
		type: string;
	};
}

const ViewPatientPrescriptionPage = () => {
	const { id } = useParams() as { id: string };
	const router = useRouter();
	const { userData } = useUser();

	const [prescription, setPrescription] = useState<Prescription | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const printRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchPrescription = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/prescriptions/${id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch prescription");
				}

				const data = await response.json();
				setPrescription(data.prescription);
			} catch (err: any) {
				console.error("Error fetching prescription:", err);
				setError(err.message || "Failed to load prescription");
			} finally {
				setLoading(false);
			}
		};

		if (userData?._id && id) {
			fetchPrescription();
		}
	}, [id, userData]);

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: `Prescription-${id}`,
		onAfterPrint: () => toast.success("Prescription printed successfully"),
	});

	const getFrequencyText = (frequency: string) => {
		switch (frequency) {
			case "once-daily":
				return "Once daily";
			case "twice-daily":
				return "Twice daily";
			case "three-times-daily":
				return "Three times daily";
			case "four-times-daily":
				return "Four times daily";
			case "every-4-hours":
				return "Every 4 hours";
			case "every-6-hours":
				return "Every 6 hours";
			case "every-8-hours":
				return "Every 8 hours";
			case "every-12-hours":
				return "Every 12 hours";
			case "as-needed":
				return "As needed (PRN)";
			default:
				return frequency;
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<Loader2 className="h-10 w-10 mx-auto animate-spin text-primary mb-4" />
						<p className="text-gray-600">Loading prescription...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !prescription) {
		return (
			<div className="container mx-auto py-8 px-4">
				<Card>
					<CardContent className="py-10">
						<div className="flex flex-col items-center justify-center text-center">
							<AlertCircle className="h-10 w-10 text-red-500 mb-4" />
							<h3 className="text-lg font-medium text-gray-800 mb-2">
								Failed to load prescription
							</h3>
							<p className="text-gray-600 mb-4">
								{error || "Prescription not found"}
							</p>
							<Button onClick={() => router.back()}>Go Back</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const appointmentDate = prescription.appointment?.date
		? new Date(prescription.appointment.date)
		: new Date(prescription.createdAt);

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<div className="flex items-center mb-4 md:mb-0">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="mr-4"
					>
						<ChevronLeft className="h-4 w-4 mr-2" />
						Back
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Prescription Details
						</h1>
						<p className="text-gray-600">
							Issued on{" "}
							{format(new Date(prescription.createdAt), "MMMM d, yyyy")}
						</p>
					</div>
				</div>
				<div className="flex space-x-3">
					<Button variant="outline" onClick={() => handlePrint()}>
						<Printer className="mr-2 h-4 w-4" />
						Print
					</Button>
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Download PDF
					</Button>
				</div>
			</div>

			{/* Printable Prescription */}
			<div ref={printRef}>
				<Card className="mb-6 print:shadow-none print:border-none">
					<CardContent className="p-8">
						<div className="flex justify-between items-start mb-8">
							<div>
								<h2 className="text-2xl font-bold text-primary">MediCare</h2>
								<p className="text-gray-600">Healthcare Management System</p>
							</div>
							<div className="text-right">
								<h3 className="font-bold text-gray-900">PRESCRIPTION</h3>
								<p className="text-gray-600">
									Rx #: {prescription._id.substring(0, 8).toUpperCase()}
								</p>
								<p className="text-gray-600">
									Date:{" "}
									{format(new Date(prescription.createdAt), "MMMM d, yyyy")}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							<div>
								<h3 className="font-bold text-gray-900 mb-2">
									Patient Information
								</h3>
								<p className="text-gray-800 font-medium">
									{userData?.fullName}
								</p>
								<p className="text-gray-600">
									{userData?.gender && userData?.age
										? `${
												userData.gender.charAt(0).toUpperCase() +
												userData.gender.slice(1)
										  }, ${userData.age} years`
										: ""}
								</p>
							</div>
							<div>
								<h3 className="font-bold text-gray-900 mb-2">
									Prescribing Doctor
								</h3>
								<p className="text-gray-800 font-medium">
									Dr. {prescription.doctorId.fullName}
								</p>
								<p className="text-gray-600">
									{prescription.doctorId.specialization || "Physician"}
								</p>
							</div>
						</div>

						<Separator className="my-6" />

						<div className="mb-6">
							<h3 className="font-bold text-gray-900 mb-2">Diagnosis</h3>
							<p className="text-gray-800 bg-gray-50 p-3 rounded-md">
								{prescription.diagnosis}
							</p>
						</div>

						<div className="mb-6">
							<h3 className="font-bold text-gray-900 mb-2">Medications</h3>
							<div className="space-y-4">
								{prescription.medications.map((medication, index) => (
									<div
										key={medication.id}
										className="bg-gray-50 p-4 rounded-md"
									>
										<div className="flex items-center mb-2">
											<Pill className="h-5 w-5 text-primary mr-2" />
											<h4 className="font-medium text-gray-900">
												{medication.name} {medication.dosage}
											</h4>
										</div>
										<div className="ml-7 space-y-1 text-gray-700">
											<p>
												<strong>Frequency:</strong>{" "}
												{getFrequencyText(medication.frequency)}
											</p>
											{medication.duration && (
												<p>
													<strong>Duration:</strong> {medication.duration}
												</p>
											)}
											{medication.instructions && (
												<p>
													<strong>Instructions:</strong>{" "}
													{medication.instructions}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{prescription.additionalNotes && (
							<div className="mb-6">
								<h3 className="font-bold text-gray-900 mb-2">
									Additional Notes
								</h3>
								<p className="text-gray-800 bg-gray-50 p-3 rounded-md">
									{prescription.additionalNotes}
								</p>
							</div>
						)}

						<Separator className="my-6" />

						<div className="mt-8 flex justify-between items-end">
							<div>
								<p className="text-gray-600 text-sm">
									This prescription is valid for 30 days from the date of issue.
								</p>
								<p className="text-gray-600 text-sm">
									Please follow the medication instructions carefully.
								</p>
							</div>
							<div className="text-right">
								<div className="border-t border-gray-300 pt-2 mt-8 w-48">
									<p className="text-gray-800 font-medium">
										Dr. {prescription.doctorId.fullName}
									</p>
									<p className="text-gray-600 text-sm">Digital Signature</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Actions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={() => handlePrint()}
					>
						<Printer className="mr-2 h-4 w-4" />
						Print Prescription
					</Button>
					<Button variant="outline" className="w-full justify-start">
						<Download className="mr-2 h-4 w-4" />
						Download as PDF
					</Button>
					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={() => router.push("/patient/appointments")}
					>
						<Calendar className="mr-2 h-4 w-4" />
						View Appointments
					</Button>
				</CardContent>
			</Card>
			<Toaster position="top-center" />
		</div>
	);
};

export default withRoleAccess(ViewPatientPrescriptionPage, ["patient"]);
