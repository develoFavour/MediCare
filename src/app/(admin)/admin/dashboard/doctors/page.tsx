"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminHeader } from "@/components/admin/AdminHeader";

import { withRoleAccess } from "@/components/withRoleAccess";
import { useUser } from "@/app/context/UserContext";
import LoadingState from "@/components/LoadingState";
import { GlassCard } from "@/components/ui/glass-card";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Search,
	UserPlus,
	Mail,
	MapPin,
	Award,
	User,
	Loader2,
	RefreshCw,
	MoreHorizontal,
	Phone,
	Star,
} from "lucide-react";

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
	phoneNumber?: string;
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

function DoctorsPage() {
	const { userData, isLoading: userLoading } = useUser();
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [specialty, setSpecialty] = useState("All Specialties");
	const [gender, setGender] = useState("All");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const router = useRouter();

	useEffect(() => {
		fetchDoctors();
	}, []);

	useEffect(() => {
		filterDoctors();
	}, [doctors, searchTerm, specialty, gender]);

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

	const fetchDoctors = async () => {
		try {
			setLoading(true);
			const response = await axios.get<Doctor[]>(
				"/api/doctors/get-doctors-list"
			);

			// Add some mock data for UI demonstration if needed
			const enhancedDoctors = response.data.map((doctor) => ({
				...doctor,
				patients: doctor.patients || Math.floor(Math.random() * 100) + 20,
				rating:
					doctor.rating ||
					Number.parseFloat((Math.random() * 2 + 3).toFixed(1)),
				experience: doctor.experience || Math.floor(Math.random() * 15) + 1,
				location:
					doctor.location ||
					["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
						Math.floor(Math.random() * 5)
					],
			}));

			setDoctors(enhancedDoctors);
			setFilteredDoctors(enhancedDoctors);
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
			Cardiology:
				"bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800",
			Dermatology:
				"bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
			Pediatrics:
				"bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
			Neurology:
				"bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
			"General Practitioner":
				"bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800",
			Orthopedics:
				"bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
			Psychiatry:
				"bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
			Oncology:
				"bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800",
			Gynecology:
				"bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800",
			Urology:
				"bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
		};

		return (
			colors[specialty] ||
			"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
		);
	};

	if (userLoading) {
		return <LoadingState />;
	}

	if (!userData) {
		return null;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 p-6 pt-4 overflow-auto">
				<div className="max-w-7xl mx-auto space-y-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<GlassCard>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
								<div>
									<h1 className="text-2xl font-bold">Doctors Directory</h1>
									<p className="text-muted-foreground">
										Manage and view all doctors in the system
									</p>
								</div>
								<Button
									onClick={() => router.push("/admin/dashboard/doctors/add")}
									className="bg-primary hover:bg-primary/90"
								>
									<UserPlus className="mr-2 h-4 w-4" />
									Add New Doctor
								</Button>
							</div>

							<div className="bg-background rounded-xl border p-4 mb-6">
								<div className="flex flex-col md:flex-row gap-4 items-end">
									<div className="flex-1">
										<label className="block text-sm font-medium mb-1">
											Search
										</label>
										<div className="relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
										<label className="block text-sm font-medium mb-1">
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
										<label className="block text-sm font-medium mb-1">
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

							<div className="flex justify-end mb-4">
								<div className="flex border rounded-md overflow-hidden">
									<Button
										variant={viewMode === "grid" ? "default" : "ghost"}
										size="sm"
										onClick={() => setViewMode("grid")}
										className="rounded-none"
									>
										Grid
									</Button>
									<Button
										variant={viewMode === "list" ? "default" : "ghost"}
										size="sm"
										onClick={() => setViewMode("list")}
										className="rounded-none"
									>
										List
									</Button>
								</div>
							</div>

							{error && (
								<div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
									{error}
								</div>
							)}

							{loading ? (
								<div className="flex flex-col items-center justify-center py-20">
									<Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
									<h3 className="text-xl font-medium">Loading doctors...</h3>
								</div>
							) : filteredDoctors.length === 0 && !error ? (
								<div className="bg-background rounded-xl border p-8 text-center">
									<div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
										<User className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-medium mb-2">No doctors found</h3>
									<p className="text-muted-foreground mb-4">
										There are no doctors matching your search criteria.
									</p>
									<Button onClick={resetFilters}>Reset Filters</Button>
								</div>
							) : viewMode === "grid" ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{filteredDoctors.map((doctor, index) => (
										<motion.div
											key={doctor._id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
										>
											<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-border">
												<div className="relative">
													<div className="h-32 bg-gradient-to-r from-primary/80 to-primary"></div>
													<div className="absolute -bottom-12 left-6">
														<div className="rounded-full border-4 border-background overflow-hidden h-24 w-24 bg-background">
															{doctor.image ? (
																<Image
																	src={
																		doctor.image ||
																		"/placeholder.svg?height=96&width=96"
																	}
																	alt={doctor.fullName}
																	width={96}
																	height={96}
																	className="object-cover h-full w-full"
																/>
															) : (
																<div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-xl">
																	{getUserInitials(doctor)}
																</div>
															)}
														</div>
													</div>
												</div>

												<CardContent className="pt-16 pb-6">
													<div className="flex justify-between items-start mb-2">
														<div>
															<h2 className="text-xl font-bold">
																{doctor.fullName}
															</h2>
															<Badge
																variant="outline"
																className={`mt-1 font-medium ${getSpecialtyColor(
																	doctor.specialty
																)}`}
															>
																{doctor.specialty}
															</Badge>
														</div>
														<div className="flex items-center bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-md">
															<Star className="w-4 h-4 text-amber-500 mr-1 fill-amber-500" />
															<span className="text-sm font-medium text-amber-700 dark:text-amber-300">
																{doctor.rating}
															</span>
														</div>
													</div>

													<div className="mt-4 space-y-2">
														<div className="flex items-center text-muted-foreground">
															<Mail className="h-4 w-4 mr-2 text-muted-foreground" />
															<span className="text-sm truncate">
																{doctor.email}
															</span>
														</div>
														<div className="flex items-center text-muted-foreground">
															<MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
															<span className="text-sm">{doctor.location}</span>
														</div>
														<div className="flex items-center text-muted-foreground">
															<Award className="h-4 w-4 mr-2 text-muted-foreground" />
															<span className="text-sm">
																{doctor.experience} years experience
															</span>
														</div>
														{doctor.phoneNumber && (
															<div className="flex items-center text-muted-foreground">
																<Phone className="h-4 w-4 mr-2 text-muted-foreground" />
																<span className="text-sm">
																	{doctor.phoneNumber}
																</span>
															</div>
														)}
													</div>

													<div className="mt-6 grid grid-cols-3 gap-2 border-t pt-4">
														<div className="text-center">
															<p className="text-xs text-muted-foreground">
																Age
															</p>
															<p className="font-semibold">{doctor.age}</p>
														</div>
														<div className="text-center border-l border-r border-border">
															<p className="text-xs text-muted-foreground">
																Gender
															</p>
															<p className="font-semibold">{doctor.gender}</p>
														</div>
														<div className="text-center">
															<p className="text-xs text-muted-foreground">
																Patients
															</p>
															<p className="font-semibold">{doctor.patients}</p>
														</div>
													</div>

													<div className="mt-6 flex gap-2">
														<Button
															variant="outline"
															className="flex-1"
															onClick={() =>
																router.push(
																	`/admin/dashboard/doctors/${doctor._id}`
																)
															}
														>
															View Profile
														</Button>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="outline" size="icon">
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem
																	onClick={() =>
																		router.push(
																			`/admin/dashboard/doctors/edit/${doctor._id}`
																		)
																	}
																>
																	Edit Profile
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		router.push(
																			`/admin/dashboard/doctors/schedule/${doctor._id}`
																		)
																	}
																>
																	View Schedule
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem className="text-destructive">
																	Deactivate Account
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}
								</div>
							) : (
								<div className="rounded-md border overflow-hidden">
									<table className="w-full">
										<thead className="bg-muted/50">
											<tr>
												<th className="text-left p-3 font-medium">Doctor</th>
												<th className="text-left p-3 font-medium hidden md:table-cell">
													Specialty
												</th>
												<th className="text-left p-3 font-medium hidden md:table-cell">
													Contact
												</th>
												<th className="text-left p-3 font-medium hidden lg:table-cell">
													Experience
												</th>
												<th className="text-left p-3 font-medium hidden lg:table-cell">
													Patients
												</th>
												<th className="text-right p-3 font-medium">Actions</th>
											</tr>
										</thead>
										<tbody>
											{filteredDoctors.map((doctor, index) => (
												<tr
													key={doctor._id}
													className="border-t border-border hover:bg-muted/50"
												>
													<td className="p-3">
														<div className="flex items-center gap-3">
															<div className="rounded-full overflow-hidden h-10 w-10 bg-background">
																{doctor.image ? (
																	<Image
																		src={
																			doctor.image ||
																			"/placeholder.svg?height=40&width=40"
																		}
																		alt={doctor.fullName}
																		width={40}
																		height={40}
																		className="object-cover h-full w-full"
																	/>
																) : (
																	<div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground font-bold">
																		{getUserInitials(doctor)}
																	</div>
																)}
															</div>
															<div>
																<div className="font-medium">
																	{doctor.fullName}
																</div>
																<div className="text-xs text-muted-foreground">
																	{doctor.gender}, {doctor.age} yrs
																</div>
															</div>
														</div>
													</td>
													<td className="p-3 hidden md:table-cell">
														<Badge
															variant="outline"
															className={`font-medium ${getSpecialtyColor(
																doctor.specialty
															)}`}
														>
															{doctor.specialty}
														</Badge>
													</td>
													<td className="p-3 hidden md:table-cell">
														<div className="text-sm text-muted-foreground">
															<div className="flex items-center">
																<Mail className="h-3 w-3 mr-1" />
																{doctor.email}
															</div>
															{doctor.phoneNumber && (
																<div className="flex items-center mt-1">
																	<Phone className="h-3 w-3 mr-1" />
																	{doctor.phoneNumber}
																</div>
															)}
														</div>
													</td>
													<td className="p-3 hidden lg:table-cell">
														<div className="flex items-center">
															<Award className="h-4 w-4 mr-2 text-primary" />
															<span>{doctor.experience} years</span>
														</div>
													</td>
													<td className="p-3 hidden lg:table-cell">
														<div className="flex items-center">
															<User className="h-4 w-4 mr-2 text-muted-foreground" />
															<span>{doctor.patients}</span>
														</div>
													</td>
													<td className="p-3 text-right">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button variant="ghost" size="icon">
																	<MoreHorizontal className="h-4 w-4" />
																	<span className="sr-only">Open menu</span>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem
																	onClick={() =>
																		router.push(
																			`/admin/dashboard/doctors/${doctor._id}`
																		)
																	}
																>
																	View Profile
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		router.push(
																			`/admin/dashboard/doctors/edit/${doctor._id}`
																		)
																	}
																>
																	Edit Profile
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		router.push(
																			`/admin/dashboard/doctors/schedule/${doctor._id}`
																		)
																	}
																>
																	View Schedule
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem className="text-destructive">
																	Deactivate Account
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</GlassCard>
					</motion.div>
				</div>
			</main>
		</div>
	);
}

export default DoctorsPage;
