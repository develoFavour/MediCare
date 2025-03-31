"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Calendar, Clock, Stethoscope, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StatsCards() {
	const [doctors, setDoctors] = useState([]);
	const [patients, setPatients] = useState([]);
	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const data = await axios
					.get("/api/doctors/get-doctors-list")
					.then((res) => res.data);
				setDoctors(data);
				console.log("Doctors fetched", data);
			} catch (error) {
				console.error("Error fetching doctors:", error);
			}
		};

		fetchDoctors();
	}, []);
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card className="border-l-4 border-l-primary">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">Total Patients</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">1,248</div>
					<p className="text-xs text-muted-foreground">+8.2% from last month</p>
				</CardContent>
			</Card>

			<Card className="border-l-4 border-l-blue-500">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
					<Stethoscope className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{doctors.length}</div>
					<p className="text-xs text-muted-foreground">
						+2 new doctors this month
					</p>
				</CardContent>
			</Card>

			<Card className="border-l-4 border-l-green-500">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						Appointments Today
					</CardTitle>
					<Calendar className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">24</div>
					<p className="text-xs text-muted-foreground">
						6 appointments remaining
					</p>
				</CardContent>
			</Card>

			<Card className="border-l-4 border-l-amber-500">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium">
						Average Wait Time
					</CardTitle>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">14 min</div>
					<p className="text-xs text-muted-foreground">-2 min from last week</p>
				</CardContent>
			</Card>
		</div>
	);
}
