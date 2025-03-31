"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Filter,
	Loader2,
	MoreHorizontal,
	Plus,
	Search,
	Star,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Doctor {
	_id: string;
	fullName: string;
	email: string;
	specialty: string;
	age: number;
	gender: string;
	profileImage?: string;
	patients?: number;
	rating?: number;
	experience?: number;
	location?: string;
}

export function DoctorsList() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [sortBy, setSortBy] = useState("name");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/doctors/get-doctors-list");

				if (!response.ok) {
					throw new Error("Failed to fetch doctors");
				}

				const data = await response.json();

				// Add some mock data for UI demonstration
				const enhancedDoctors = data.map((doctor: Doctor) => ({
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

	const filteredDoctors = doctors
		.filter(
			(doctor) =>
				doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === "name") {
				return a.fullName.localeCompare(b.fullName);
			} else if (sortBy === "patients") {
				return (b.patients || 0) - (a.patients || 0);
			} else if (sortBy === "experience") {
				return (b.experience || 0) - (a.experience || 0);
			} else if (sortBy === "rating") {
				return (b.rating || 0) - (a.rating || 0);
			}
			return 0;
		})
		.slice(0, 6); // Show only 6 doctors on dashboard

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-lg font-semibold text-gray-900">
					Doctors
				</CardTitle>
				<div className="flex items-center gap-2">
					<Link href="/admin/dashboard/doctors">
						<Button variant="outline" size="sm">
							View All
						</Button>
					</Link>
					<Link href="/admin/dashboard/doctors/add-doctor">
						<Button size="sm" className="bg-primary hover:bg-primary/90">
							<Plus className="mr-2 h-4 w-4" /> Add Doctor
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-grow">
						<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							className="pl-8 bg-background"
							placeholder="Search doctors by name or specialty..."
							onChange={(e) => setSearchTerm(e.target.value)}
							value={searchTerm}
						/>
					</div>
					<Select onValueChange={setSortBy} defaultValue="name">
						<SelectTrigger className="w-[180px]">
							<Filter className="mr-2 h-4 w-4" />
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="experience">Experience</SelectItem>
							<SelectItem value="patients">Patients</SelectItem>
							<SelectItem value="rating">Rating</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{loading ? (
					<div className="flex flex-col items-center justify-center py-12">
						<Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
						<p className="text-muted-foreground">Loading doctors...</p>
					</div>
				) : error ? (
					<div className="bg-red-50 text-red-700 p-4 rounded-md text-center">
						{error}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredDoctors.length > 0 ? (
							filteredDoctors.map((doctor) => (
								<DoctorCard key={doctor._id} doctor={doctor} />
							))
						) : (
							<p className="col-span-full text-center text-gray-500 py-8">
								No doctors matched your search.
							</p>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
	const router = useRouter();

	return (
		<div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between">
				<div className="flex items-center space-x-3">
					<Avatar className="h-12 w-12">
						<AvatarImage
							src={doctor.profileImage || "/placeholder.svg?height=40&width=40"}
							alt={doctor.fullName}
						/>
						<AvatarFallback>{doctor.fullName.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="font-medium text-gray-900">{doctor.fullName}</h3>
						<div className="flex items-center">
							<Badge
								variant="outline"
								className="bg-blue-50 text-blue-700 border-blue-200 mr-2"
							>
								{doctor.specialty}
							</Badge>
							<div className="flex items-center text-amber-500">
								<Star className="h-3 w-3 fill-current" />
								<span className="text-xs ml-1">{doctor.rating}</span>
							</div>
						</div>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								router.push(`/admin/dashboard/doctors/${doctor._id}`)
							}
						>
							View Profile
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								router.push(`/admin/dashboard/doctors/edit/${doctor._id}`)
							}
						>
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							Deactivate
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid grid-cols-2 gap-2 mt-4 text-sm">
				<div>
					<p className="text-gray-500">Patients</p>
					<p className="font-medium">{doctor.patients}</p>
				</div>
				<div>
					<p className="text-gray-500">Experience</p>
					<p className="font-medium">{doctor.experience} years</p>
				</div>
			</div>
		</div>
	);
}
