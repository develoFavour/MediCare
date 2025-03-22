"use client";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Doctor from "./Doctor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Link from "next/link";

interface DoctorType {
	_id: string;
	fullName: string;
	email: string;
	specialty: string;
	age: number;
	gender: string;
	image?: string;
	patients?: number;
	rating?: number;
	experience?: number;
	location?: string;
}

const AvailableDoctors = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [doctors, setDoctors] = useState<DoctorType[]>([]);
	const [sortDoctor, setSortDoctor] = useState("name");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setLoading(true);
				const response = await axios.get("/api/doctors/get-doctors-list");

				// Add some mock data for UI demonstration
				const enhancedDoctors = response.data.map((doctor: DoctorType) => ({
					...doctor,
					patients: Math.floor(Math.random() * 100) + 20,
					rating: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)),
					experience: Math.floor(Math.random() * 15) + 1,
					location: [
						"New York",
						"Los Angeles",
						"Chicago",
						"Houston",
						"Phoenix",
					][Math.floor(Math.random() * 5)],
				}));

				setDoctors(enhancedDoctors);
				setError(null);
			} catch (error) {
				console.error("Error fetching doctors:", error);
				setError("Failed to load doctors. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchDoctors();
	}, []);

	const searchDoctor = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const sortDoctorFn = (value: string) => {
		setSortDoctor(value);
	};

	const filteredDoctors = useMemo(() => {
		return doctors
			.filter(
				(doctor: DoctorType) =>
					doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a: DoctorType, b: DoctorType) => {
				if (sortDoctor === "name") {
					return a.fullName.localeCompare(b.fullName);
				} else if (sortDoctor === "patients") {
					return (b.patients || 0) - (a.patients || 0);
				} else if (sortDoctor === "experience") {
					return (b.experience || 0) - (a.experience || 0);
				} else {
					return 0;
				}
			});
	}, [doctors, searchTerm, sortDoctor]);

	return (
		<div className="space-y-6 bg-[#F8FAFC] p-6 rounded-lg shadow-sm">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-[#1565C0]">Available Doctors</h1>
				<Link href="/admin/dashboard/doctors/add-doctor">
					<Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white">
						<Plus className="mr-2 h-4 w-4" /> Add New Doctor
					</Button>
				</Link>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 mb-6">
				<div className="relative flex-grow">
					<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#4B8BF7]" />
					<Input
						className="pl-8 border-[#E3F2FD] focus:border-[#4B8BF7] bg-white"
						placeholder="Search doctors by name or specialty..."
						onChange={searchDoctor}
						value={searchTerm}
					/>
				</div>
				<Select onValueChange={sortDoctorFn} defaultValue="name">
					<SelectTrigger className="w-[180px] text-[#1565C0]">
						<Filter className="mr-2 h-4 w-4 text-[#1565C0]" />
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent className="bg-white text-[#1565C0]">
						<SelectItem value="name">Name</SelectItem>
						<SelectItem value="experience">Experience</SelectItem>
						<SelectItem value="patients">Patients</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{loading ? (
				<div className="flex flex-col items-center justify-center py-12">
					<Loader2 className="h-8 w-8 text-[#4B8BF7] animate-spin mb-4" />
					<p className="text-[#1565C0]">Loading doctors...</p>
				</div>
			) : error ? (
				<div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
					{error}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredDoctors.length > 0 ? (
						filteredDoctors.map((doctor) => (
							<Doctor key={doctor._id} doctor={doctor} />
						))
					) : (
						<p className="col-span-full text-center text-gray-500 py-8">
							No doctors matched your search.
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default AvailableDoctors;
