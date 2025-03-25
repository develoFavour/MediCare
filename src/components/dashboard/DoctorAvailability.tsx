"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Doctor {
	_id: string;
	fullName: string;
	specialty: string;
	profileImage?: string;
	availableDays: string[];
	nextAvailable: string;
}

export function DoctorAvailability() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [doctors, setDoctors] = useState<Doctor[]>([]);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get("/api/patient/doctors/available");
				setDoctors(response.data.doctors);
			} catch (err) {
				console.error("Error fetching available doctors:", err);
				setError("Failed to load doctor availability");
			} finally {
				setLoading(false);
			}
		};

		fetchDoctors();
	}, []);

	const getUserInitials = (fullName: string) => {
		const names = fullName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return fullName.substring(0, 2).toUpperCase();
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold flex items-center">
						<User className="h-5 w-5 mr-2 text-green-600" />
						Available Doctors
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						className="text-primary"
						onClick={() => router.push("/patient/doctors")}
					>
						View All <ArrowRight className="ml-1 h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex space-x-3">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
					</div>
				) : error ? (
					<div className="text-center text-red-500 py-4">
						{error}. Please try refreshing the page.
					</div>
				) : doctors.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						No available doctors found at the moment.
					</div>
				) : (
					<div className="space-y-4">
						{doctors.map((doctor) => (
							<div
								key={doctor._id}
								className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
							>
								<div className="flex-shrink-0">
									{doctor.profileImage ? (
										<Image
											src={doctor.profileImage || "/placeholder.svg"}
											alt={doctor.fullName}
											width={48}
											height={48}
											className="rounded-full object-cover"
										/>
									) : (
										<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
											{getUserInitials(doctor.fullName)}
										</div>
									)}
								</div>
								<div className="flex-1">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-gray-900">
												{doctor.fullName}
											</h3>
											<Badge
												variant="outline"
												className="mt-1 bg-primary/10 text-primary border-primary/20"
											>
												{doctor.specialty}
											</Badge>
										</div>
										<Badge
											variant="outline"
											className="bg-green-100 text-green-800 border-green-200 flex items-center"
										>
											<Calendar className="mr-1 h-3 w-3" />
											Next:{" "}
											{new Date(doctor.nextAvailable).toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
												}
											)}
										</Badge>
									</div>
									<div className="mt-2 flex flex-wrap gap-1">
										{doctor.availableDays.map((day) => (
											<Badge
												key={day}
												variant="outline"
												className="bg-gray-100 text-gray-700"
											>
												{day}
											</Badge>
										))}
									</div>
									<div className="mt-3 flex justify-end">
										<Button
											size="sm"
											onClick={() =>
												router.push(
													`/patient/appointments/book?doctor=${doctor._id}`
												)
											}
										>
											Book Appointment
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
