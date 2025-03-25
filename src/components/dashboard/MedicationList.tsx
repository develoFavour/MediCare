"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Medication {
	_id: string;
	name: string;
	dosage: string;
	frequency: string;
	time: string;
	purpose: string;
	refillDate?: string;
	instructions?: string;
}

export function MedicationsList() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [medications, setMedications] = useState<Medication[]>([]);

	useEffect(() => {
		const fetchMedications = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get("/api/patient/medications");
				setMedications(response.data.medications);
			} catch (err) {
				console.error("Error fetching medications:", err);
				setError("Failed to load medications");
			} finally {
				setLoading(false);
			}
		};

		fetchMedications();
	}, []);

	const requestRefill = async (id: string) => {
		try {
			await axios.post(`/api/patient/medications/${id}/refill-request`);
			// Show success message or update UI
		} catch (err) {
			console.error("Error requesting refill:", err);
		}
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold">
						Current Medications
					</CardTitle>
					<Button
						variant="outline"
						onClick={() => router.push("/patient/medications/add")}
					>
						<Plus className="mr-2 h-4 w-4" /> Add Medication
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex flex-col space-y-2">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-2/3" />
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center text-red-500 py-4">
						{error}. Please try refreshing the page.
					</div>
				) : medications.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<p className="mb-4">No medications found.</p>
						<Button
							variant="outline"
							onClick={() => router.push("/patient/medications/add")}
						>
							<Plus className="mr-2 h-4 w-4" /> Add Medication
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{medications.map((medication) => (
							<div key={medication._id} className="p-4 bg-gray-50 rounded-lg">
								<div className="flex flex-col md:flex-row md:justify-between md:items-start">
									<div>
										<div className="flex items-center">
											<h3 className="font-medium text-gray-900 text-lg">
												{medication.name}
											</h3>
											<Badge
												variant="outline"
												className="ml-2 bg-amber-50 text-amber-700 border-amber-200"
											>
												{medication.dosage}
											</Badge>
										</div>
										<p className="text-sm text-gray-600 mt-1">
											Purpose: {medication.purpose}
										</p>
									</div>
									<div className="mt-2 md:mt-0 text-right">
										{medication.refillDate && (
											<p className="text-sm font-medium text-gray-900">
												Refill by:{" "}
												{new Date(medication.refillDate).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
													}
												)}
											</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
									<div>
										<p className="text-sm text-gray-600">
											<strong>Frequency:</strong> {medication.frequency}
										</p>
										<p className="text-sm text-gray-600 mt-1">
											<strong>Time:</strong> {medication.time}
										</p>
									</div>
									<div>
										{medication.instructions && (
											<p className="text-sm text-gray-600">
												<strong>Instructions:</strong> {medication.instructions}
											</p>
										)}
									</div>
								</div>

								<div className="flex justify-end mt-4 gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => requestRefill(medication._id)}
									>
										Request Refill
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											router.push(`/patient/medications/edit/${medication._id}`)
										}
									>
										Edit
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
