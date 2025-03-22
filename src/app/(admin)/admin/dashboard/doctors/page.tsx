"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Search,
	UserPlus,
	Mail,
	MapPin,
	Award,
	User,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Doctor {
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

const specialties = [
	"All Specialties",
	"Cardiology",
	"Dermatology",
	"Pediatrics",
	"Neurology",
	"General Practitioner",
	"Orthopedics",
	"Psychiatry",
	"Oncology",
	"Gynecology",
	"Urology",
];

const DoctorsList = () => {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [specialty, setSpecialty] = useState("All Specialties");
	const [gender, setGender] = useState("All");

	useEffect(() => {
		fetchDoctors();
	}, []);

	useEffect(() => {
		const filterDoctors = () => {
			let filtered = [...doctors];

			// Filter by search term
			if (searchTerm) {
				filtered = filtered.filter(
					(doctor) =>
						doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
						doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
						doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
				);
			}

			// Filter by specialty
			if (specialty !== "All Specialties") {
				filtered = filtered.filter((doctor) => doctor.specialty === specialty);
			}

			// Filter by gender
			if (gender !== "All") {
				filtered = filtered.filter((doctor) => doctor.gender === gender);
			}

			setFilteredDoctors(filtered);
		};
	}, [doctors, searchTerm, specialty, gender]);

	const fetchDoctors = async () => {
		try {
			setLoading(true);
			const response = await axios.get<Doctor[]>(
				"/api/doctors/get-doctors-list"
			);

			// Add some mock data for UI demonstration
			const enhancedDoctors = response.data.map((doctor) => ({
				...doctor,
				patients: Math.floor(Math.random() * 100) + 20,
				rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
				experience: Math.floor(Math.random() * 15) + 1,
				location: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
					Math.floor(Math.random() * 5)
				],
			}));

			setDoctors(enhancedDoctors);
			setFilteredDoctors(enhancedDoctors);
			console.log("Response:", enhancedDoctors);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(
					`Error fetching doctors: ${
						error.response?.data?.message || error.message
					}`
				);
				console.error("Error details:", error.response?.data);
			} else {
				setError("An unknown error occurred");
			}
			console.error("Error fetching doctors:", error);
		} finally {
			setLoading(false);
		}
	};

	const resetFilters = () => {
		setSearchTerm("");
		setSpecialty("All Specialties");
		setGender("All");
	};
	const getUserInitials = (doctor: Doctor) => {
		if (!doctor?.fullName) return "";
		const names = doctor.fullName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return doctor.fullName.substring(0, 2).toUpperCase();
	};

	const getSpecialtyColor = (specialty: string) => {
		const colors: { [key: string]: string } = {
			Cardiology: "bg-red-100 text-red-800",
			Dermatology: "bg-purple-100 text-purple-800",
			Pediatrics: "bg-blue-100 text-blue-800",
			Neurology: "bg-yellow-100 text-yellow-800",
			"General Practitioner": "bg-green-100 text-green-800",
			Orthopedics: "bg-orange-100 text-orange-800",
			Psychiatry: "bg-indigo-100 text-indigo-800",
			Oncology: "bg-pink-100 text-pink-800",
			Gynecology: "bg-teal-100 text-teal-800",
			Urology: "bg-cyan-100 text-cyan-800",
		};

		return colors[specialty] || "bg-gray-100 text-gray-800";
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<Loader2 className="h-12 w-12 text-[#116aef] animate-spin mb-4" />
				<h3 className="text-xl font-medium text-gray-700">
					Loading doctors...
				</h3>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Doctors Directory
					</h1>
					<p className="text-gray-500">
						Manage and view all doctors in the system
					</p>
				</div>
				<div className="mt-4 md:mt-0">
					<Link href="/admin/dashboard/doctors/add">
						<Button className="bg-[#116aef] hover:bg-[#0f5ed8] text-white flex items-center gap-2">
							<UserPlus className="h-4 w-4" />
							Add New Doctor
						</Button>
					</Link>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4 items-end">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Search
						</label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								type="text"
								placeholder="Search by name, email, or specialty"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
					<div className="w-full md:w-48">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Specialty
						</label>
						<Select value={specialty} onValueChange={setSpecialty}>
							<SelectTrigger>
								<SelectValue placeholder="All Specialties" />
							</SelectTrigger>
							<SelectContent>
								{specialties.map((spec) => (
									<SelectItem key={spec} value={spec}>
										{spec}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="w-full md:w-48">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Gender
						</label>
						<Select value={gender} onValueChange={setGender}>
							<SelectTrigger>
								<SelectValue placeholder="All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								<SelectItem value="Male">Male</SelectItem>
								<SelectItem value="Female">Female</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={resetFilters}
							className="flex items-center gap-2"
						>
							<RefreshCw className="h-4 w-4" />
							Reset
						</Button>
						<Button
							variant="outline"
							onClick={fetchDoctors}
							className="flex items-center gap-2"
						>
							<RefreshCw className="h-4 w-4" />
							Refresh
						</Button>
					</div>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			{filteredDoctors.length === 0 && !error ? (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
					<div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
						<User className="h-8 w-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-800 mb-2">
						No doctors found
					</h3>
					<p className="text-gray-500 mb-4">
						There are no doctors matching your search criteria.
					</p>
					<Button onClick={resetFilters}>Reset Filters</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredDoctors.map((doctor, index) => (
						<motion.div
							key={doctor._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
						>
							<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-100">
								<div className="relative">
									<div className="h-32 bg-gradient-to-r from-blue-500 to-[#116aef]"></div>
									<div className="absolute -bottom-12 left-6">
										<div className="rounded-full border-4 border-white overflow-hidden h-24 w-24 bg-white">
											{doctor.image ? (
												<Image
													src={doctor.image || "/placeholder.svg"}
													alt={doctor.fullName}
													width={96}
													height={96}
													className="object-cover h-full w-full"
												/>
											) : (
												<div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-xl">
													{getUserInitials(doctor)}
												</div>
											)}
										</div>
									</div>
								</div>

								<CardContent className="pt-16 pb-6">
									<div className="flex justify-between items-start mb-2">
										<div>
											<h2 className="text-xl font-bold text-gray-800">
												{doctor.fullName}
											</h2>
											<Badge
												className={`mt-1 font-medium ${getSpecialtyColor(
													doctor.specialty
												)}`}
											>
												{doctor.specialty}
											</Badge>
										</div>
										<div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
											<svg
												className="w-4 h-4 text-yellow-500 mr-1"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
											<span className="text-sm font-medium text-yellow-700">
												{doctor.rating}
											</span>
										</div>
									</div>

									<div className="mt-4 space-y-2">
										<div className="flex items-center text-gray-600">
											<Mail className="h-4 w-4 mr-2 text-gray-400" />
											<span className="text-sm truncate">{doctor.email}</span>
										</div>
										<div className="flex items-center text-gray-600">
											<MapPin className="h-4 w-4 mr-2 text-gray-400" />
											<span className="text-sm">{doctor.location}</span>
										</div>
										<div className="flex items-center text-gray-600">
											<Award className="h-4 w-4 mr-2 text-gray-400" />
											<span className="text-sm">
												{doctor.experience} years experience
											</span>
										</div>
									</div>

									<div className="mt-6 grid grid-cols-3 gap-2 border-t pt-4">
										<div className="text-center">
											<p className="text-xs text-gray-500">Age</p>
											<p className="font-semibold text-gray-800">
												{doctor.age}
											</p>
										</div>
										<div className="text-center border-l border-r">
											<p className="text-xs text-gray-500">Gender</p>
											<p className="font-semibold text-gray-800">
												{doctor.gender}
											</p>
										</div>
										<div className="text-center">
											<p className="text-xs text-gray-500">Patients</p>
											<p className="font-semibold text-gray-800">
												{doctor.patients}
											</p>
										</div>
									</div>

									<div className="mt-6">
										<Button variant="outline" className="w-full">
											View Profile
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
};

export default DoctorsList;
