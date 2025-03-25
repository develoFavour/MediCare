"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, Phone, MapPin } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";

interface PatientProfileData {
	appointmentCount: number;
	lastVisit: string | null;
}

export function PatientProfile() {
	const { userData } = useUser();
	const [loading, setLoading] = useState(false);
	const [profileData, setProfileData] = useState<PatientProfileData>({
		appointmentCount: 0,
		lastVisit: null,
	});
	const [error, setError] = useState<string | null>(null);
	console.log(userData);

	return (
		<Card className="bg-white shadow-sm">
			<CardContent className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{loading ? (
						<>
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-16 w-16 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
							))}
						</>
					) : error ? (
						<div className="col-span-4 text-center text-red-500 py-4">
							{error}. Please try refreshing the page.
						</div>
					) : (
						<>
							<div className="flex items-center gap-4">
								<div className="bg-blue-100 p-4 rounded-full">
									<User className="h-8 w-8 text-primary" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Patient Name</p>
									<p className="text-lg font-semibold">
										{userData?.fullName || "N/A"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="bg-green-100 p-4 rounded-full">
									<Calendar className="h-8 w-8 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Last Visit</p>
									<p className="text-lg font-semibold">
										{profileData.lastVisit
											? new Date(profileData.lastVisit).toLocaleDateString()
											: "No visits yet"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="bg-purple-100 p-4 rounded-full">
									<Phone className="h-8 w-8 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Contact</p>
									<p className="text-lg font-semibold">
										{userData?.phoneNumber || "Not provided"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="bg-amber-100 p-4 rounded-full">
									<MapPin className="h-8 w-8 text-amber-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Total Appointments</p>
									<p className="text-lg font-semibold">
										{profileData.appointmentCount}
									</p>
								</div>
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
