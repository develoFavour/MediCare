"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { withRoleAccess } from "@/components/withRoleAccess";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "react-hot-toast";
import { format } from "date-fns";
import {
	ChevronLeft,
	Plus,
	Trash2,
	Save,
	FileText,
	Send,
	Download,
	Loader2,
	AlertCircle,
	Calendar,
	Clock,
	User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Appointment {
	_id: string;
	userId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
		age?: number;
		gender?: string;
	};
	doctorId: {
		_id: string;
		fullName: string;
		email: string;
		profileImage?: string;
	};
	date: string;
	reason: string;
	type: string;
	notes: string;
	status: string;
}

interface Medication {
	id: string;
	name: string;
	dosage: string;
	frequency: string;
	duration: string;
	instructions: string;
}

interface Prescription {
	_id?: string;
	appointmentId: string;
	patientId: string;
	doctorId: string;
	diagnosis: string;
	symptoms: string;
	medications: Medication[];
	additionalNotes: string;
	status: "draft" | "issued";
	createdAt?: string;
	updatedAt?: string;
}

const CreatePrescriptionPage = () => {
	const { id } = useParams() as { id: string };
	const router = useRouter();
	const { userData } = useUser();

	const [appointment, setAppointment] = useState<Appointment | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [issuing, setIssuing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [prescription, setPrescription] = useState<Prescription>({
		appointmentId: id,
		patientId: "",
		doctorId: "",
		diagnosis: "",
		symptoms: "",
		medications: [
			{
				id: crypto.randomUUID(),
				name: "",
				dosage: "",
				frequency: "",
				duration: "",
				instructions: "",
			},
		],
		additionalNotes: "",
		status: "draft",
	});

	const [existingPrescription, setExistingPrescription] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchAppointmentDetails = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch appointment details
				const appointmentResponse = await fetch(`/api/appointments/${id}`);
				if (!appointmentResponse.ok) {
					throw new Error("Failed to fetch appointment details");
				}

				const appointmentData = await appointmentResponse.json();
				setAppointment(appointmentData.appointment);

				// Check if prescription already exists for this appointment
				const prescriptionResponse = await fetch(
					`/api/prescriptions?appointmentId=${id}`
				);
				if (prescriptionResponse.ok) {
					const prescriptionData = await prescriptionResponse.json();

					if (prescriptionData.prescription) {
						setPrescription(prescriptionData.prescription);
						setExistingPrescription(true);
					} else {
						// Initialize new prescription with appointment data
						setPrescription((prev) => ({
							...prev,
							patientId: appointmentData.appointment.userId._id,
							doctorId: userData?._id || "",
							symptoms: appointmentData.appointment.reason || "",
						}));
					}
				}
			} catch (err: any) {
				console.error("Error fetching data:", err);
				setError(err.message || "Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		if (userData?._id && id) {
			fetchAppointmentDetails();
		}
	}, [id, userData]);

	const handleInputChange = (field: keyof Prescription, value: string) => {
		setPrescription((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleMedicationChange = (
		index: number,
		field: keyof Medication,
		value: string
	) => {
		setPrescription((prev) => {
			const updatedMedications = [...prev.medications];
			updatedMedications[index] = {
				...updatedMedications[index],
				[field]: value,
			};
			return {
				...prev,
				medications: updatedMedications,
			};
		});
	};

	const addMedication = () => {
		setPrescription((prev) => ({
			...prev,
			medications: [
				...prev.medications,
				{
					id: crypto.randomUUID(),
					name: "",
					dosage: "",
					frequency: "",
					duration: "",
					instructions: "",
				},
			],
		}));
	};

	const removeMedication = (index: number) => {
		setPrescription((prev) => {
			const updatedMedications = [...prev.medications];
			updatedMedications.splice(index, 1);
			return {
				...prev,
				medications: updatedMedications,
			};
		});
	};

	const savePrescription = async (status: "draft" | "issued" = "draft") => {
		try {
			if (status === "draft") {
				setSaving(true);
			} else {
				setIssuing(true);
			}

			// Validate required fields
			if (status === "issued") {
				if (!prescription.diagnosis.trim()) {
					toast.error("Please enter a diagnosis");
					setIssuing(false);
					return;
				}

				if (prescription.medications.length === 0) {
					toast.error("Please add at least one medication");
					setIssuing(false);
					return;
				}

				// Check if all medications have required fields
				const invalidMedication = prescription.medications.find(
					(med) =>
						!med.name.trim() || !med.dosage.trim() || !med.frequency.trim()
				);

				if (invalidMedication) {
					toast.error("Please complete all required medication fields");
					setIssuing(false);
					return;
				}
			}

			const updatedPrescription = {
				...prescription,
				status,
			};

			const method = existingPrescription ? "PUT" : "POST";
			const url = existingPrescription
				? `/api/prescriptions/${prescription._id}`
				: "/api/prescriptions";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedPrescription),
			});

			if (!response.ok) {
				throw new Error("Failed to save prescription");
			}

			const data = await response.json();

			// Update local state with saved prescription
			setPrescription(data.prescription);
			setExistingPrescription(true);

			toast.success(
				status === "draft"
					? "Prescription saved as draft"
					: "Prescription issued successfully"
			);

			// If issued, redirect to prescription view
			if (status === "issued") {
				router.push(
					`/doctor/dashboard/prescriptions/view/${data.prescription._id}`
				);
			}
		} catch (err: any) {
			console.error("Error saving prescription:", err);
			toast.error(err.message || "Failed to save prescription");
		} finally {
			setSaving(false);
			setIssuing(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto py-8 px-4">
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<Loader2 className="h-10 w-10 mx-auto animate-spin text-primary mb-4" />
						<p className="text-gray-600">Loading prescription data...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !appointment) {
		return (
			<div className="container mx-auto py-8 px-4">
				<Card>
					<CardContent className="py-10">
						<div className="flex flex-col items-center justify-center text-center">
							<AlertCircle className="h-10 w-10 text-red-500 mb-4" />
							<h3 className="text-lg font-medium text-gray-800 mb-2">
								Failed to load data
							</h3>
							<p className="text-gray-600 mb-4">
								{error || "Appointment not found"}
							</p>
							<Button onClick={() => router.back()}>Go Back</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const appointmentDate = new Date(appointment.date);
	const patient = appointment.userId;

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
							{existingPrescription
								? "Edit Prescription"
								: "Create Prescription"}
						</h1>
						<p className="text-gray-600">
							{existingPrescription
								? `Last updated: ${format(
										new Date(prescription.updatedAt || new Date()),
										"MMM d, yyyy 'at' h:mm a"
								  )}`
								: "Prescribe medications for your patient"}
						</p>
					</div>
				</div>
				<div className="flex space-x-3">
					<Button
						variant="outline"
						onClick={() => savePrescription("draft")}
						disabled={saving}
					>
						{saving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save Draft
							</>
						)}
					</Button>
					<Button
						onClick={() => savePrescription("issued")}
						disabled={issuing}
						className="bg-primary hover:bg-primary/90"
					>
						{issuing ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Issuing...
							</>
						) : (
							<>
								<FileText className="mr-2 h-4 w-4" />
								Issue Prescription
							</>
						)}
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					{/* Prescription Details */}
					<Card>
						<CardHeader>
							<CardTitle>Prescription Details</CardTitle>
							<CardDescription>
								Enter diagnosis and symptoms for the patient
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="symptoms">Symptoms</Label>
								<Textarea
									id="symptoms"
									placeholder="Patient's symptoms"
									value={prescription.symptoms}
									onChange={(e) =>
										handleInputChange("symptoms", e.target.value)
									}
									className="min-h-[100px]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="diagnosis">Diagnosis</Label>
								<Textarea
									id="diagnosis"
									placeholder="Enter your diagnosis"
									value={prescription.diagnosis}
									onChange={(e) =>
										handleInputChange("diagnosis", e.target.value)
									}
									className="min-h-[100px]"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Medications */}
					<Card>
						<CardHeader>
							<CardTitle>Medications</CardTitle>
							<CardDescription>
								Add medications with dosage and instructions
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{prescription.medications.map((medication, index) => (
								<div key={medication.id} className="space-y-4">
									{index > 0 && <Separator className="my-6" />}
									<div className="flex justify-between items-center">
										<h3 className="font-medium text-gray-900">
											Medication #{index + 1}
										</h3>
										{prescription.medications.length > 1 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeMedication(index)}
												className="text-red-500 hover:text-red-700 hover:bg-red-50"
											>
												<Trash2 className="h-4 w-4 mr-2" />
												Remove
											</Button>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor={`medication-name-${index}`}>
												Medication Name
											</Label>
											<Input
												id={`medication-name-${index}`}
												placeholder="e.g., Amoxicillin"
												value={medication.name}
												onChange={(e) =>
													handleMedicationChange(index, "name", e.target.value)
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor={`medication-dosage-${index}`}>
												Dosage
											</Label>
											<Input
												id={`medication-dosage-${index}`}
												placeholder="e.g., 500mg"
												value={medication.dosage}
												onChange={(e) =>
													handleMedicationChange(
														index,
														"dosage",
														e.target.value
													)
												}
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor={`medication-frequency-${index}`}>
												Frequency
											</Label>
											<Select
												value={medication.frequency}
												onValueChange={(value) =>
													handleMedicationChange(index, "frequency", value)
												}
											>
												<SelectTrigger id={`medication-frequency-${index}`}>
													<SelectValue placeholder="Select frequency" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="once-daily">Once daily</SelectItem>
													<SelectItem value="twice-daily">
														Twice daily
													</SelectItem>
													<SelectItem value="three-times-daily">
														Three times daily
													</SelectItem>
													<SelectItem value="four-times-daily">
														Four times daily
													</SelectItem>
													<SelectItem value="every-4-hours">
														Every 4 hours
													</SelectItem>
													<SelectItem value="every-6-hours">
														Every 6 hours
													</SelectItem>
													<SelectItem value="every-8-hours">
														Every 8 hours
													</SelectItem>
													<SelectItem value="every-12-hours">
														Every 12 hours
													</SelectItem>
													<SelectItem value="as-needed">
														As needed (PRN)
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor={`medication-duration-${index}`}>
												Duration
											</Label>
											<Input
												id={`medication-duration-${index}`}
												placeholder="e.g., 7 days"
												value={medication.duration}
												onChange={(e) =>
													handleMedicationChange(
														index,
														"duration",
														e.target.value
													)
												}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor={`medication-instructions-${index}`}>
											Special Instructions
										</Label>
										<Textarea
											id={`medication-instructions-${index}`}
											placeholder="e.g., Take with food"
											value={medication.instructions}
											onChange={(e) =>
												handleMedicationChange(
													index,
													"instructions",
													e.target.value
												)
											}
										/>
									</div>
								</div>
							))}

							<Button
								variant="outline"
								onClick={addMedication}
								className="w-full mt-4"
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Another Medication
							</Button>
						</CardContent>
					</Card>

					{/* Additional Notes */}
					<Card>
						<CardHeader>
							<CardTitle>Additional Notes</CardTitle>
							<CardDescription>
								Add any additional instructions or notes for the patient
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Textarea
								placeholder="Additional notes or instructions"
								value={prescription.additionalNotes}
								onChange={(e) =>
									handleInputChange("additionalNotes", e.target.value)
								}
								className="min-h-[150px]"
							/>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					{/* Patient Information */}
					<Card>
						<CardHeader>
							<CardTitle>Patient Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center mb-4">
								<Avatar className="h-12 w-12 mr-4">
									<AvatarImage
										src={patient.profileImage}
										alt={patient.fullName}
									/>
									<AvatarFallback>
										{patient.fullName
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<h3 className="font-medium text-gray-900">
										{patient.fullName}
									</h3>
									<p className="text-sm text-gray-500">
										{patient.gender && patient.age
											? `${
													patient.gender.charAt(0).toUpperCase() +
													patient.gender.slice(1)
											  }, ${patient.age} years`
											: "Patient"}
									</p>
								</div>
							</div>

							<div className="space-y-3 mt-4">
								<div className="flex items-start">
									<User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-gray-700">
											Patient ID
										</p>
										<p className="text-sm text-gray-600">{patient._id}</p>
									</div>
								</div>
								<div className="flex items-start">
									<Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-gray-700">
											Appointment Date
										</p>
										<p className="text-sm text-gray-600">
											{format(appointmentDate, "MMMM d, yyyy")}
										</p>
									</div>
								</div>
								<div className="flex items-start">
									<Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-gray-700">
											Appointment Time
										</p>
										<p className="text-sm text-gray-600">
											{format(appointmentDate, "h:mm a")}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Prescription Status */}
					<Card>
						<CardHeader>
							<CardTitle>Prescription Status</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center mb-4">
								<Badge
									variant="outline"
									className={
										prescription.status === "draft"
											? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
											: "bg-green-100 text-green-800 hover:bg-green-100"
									}
								>
									{prescription.status === "draft" ? "Draft" : "Issued"}
								</Badge>
								<span className="ml-2 text-sm text-gray-500">
									{existingPrescription && prescription.updatedAt
										? `Last updated: ${format(
												new Date(prescription.updatedAt),
												"MMM d, yyyy"
										  )}`
										: "Not saved yet"}
								</span>
							</div>

							<div className="space-y-3 mt-4">
								{prescription.status === "issued" ? (
									<div className="space-y-3">
										<Button variant="outline" className="w-full">
											<Download className="h-4 w-4 mr-2" />
											Download PDF
										</Button>
										<Button variant="outline" className="w-full">
											<Send className="h-4 w-4 mr-2" />
											Email to Patient
										</Button>
									</div>
								) : (
									<div className="p-3 bg-blue-50 rounded-md">
										<p className="text-sm text-blue-800">
											This prescription is currently in draft mode. Once
											you&apos;re ready, click &apos;Issue Prescription&apos; to
											finalize it.
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<Toaster position="top-center" />
		</div>
	);
};

export default withRoleAccess(CreatePrescriptionPage, ["doctor"]);
