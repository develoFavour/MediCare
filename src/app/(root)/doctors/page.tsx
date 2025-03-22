"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Calendar, ArrowRight, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Doctor {
	_id: string;
	fullName: string;
	email: string;
	specialty: string;
	age: number;
	gender: string;
	image?: string;
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

export default function DoctorsPage() {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const response = await fetch("/api/doctors/get-doctors-list");
				if (!response.ok) {
					throw new Error("Failed to fetch doctors");
				}
				const data = await response.json();
				setDoctors(data);
				setFilteredDoctors(data);
			} catch (error) {
				console.error("Error fetching doctors:", error);
				setError("Failed to load doctors. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchDoctors();
	}, []);

	const getDoctorsInitials = (fullName: string) => {
		const name = fullName.split(" ");
		if (name.length > 2) {
			return name[0][0] + name[1][0];
		}
	};

	useEffect(() => {
		let result = doctors;

		// Filter by specialty
		if (selectedSpecialty !== "All Specialties") {
			result = result.filter(
				(doctor) => doctor.specialty === selectedSpecialty
			);
		}

		// Filter by search term
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter(
				(doctor) =>
					doctor.fullName.toLowerCase().includes(term) ||
					doctor.specialty.toLowerCase().includes(term)
			);
		}

		setFilteredDoctors(result);
	}, [searchTerm, selectedSpecialty, doctors]);

	// Get a random rating between 4.0 and 5.0
	const getRandomRating = () => {
		return (4 + Math.random()).toFixed(1);
	};

	// Get a random number of reviews between 10 and 100
	const getRandomReviews = () => {
		return Math.floor(Math.random() * 90) + 10;
	};

	// Get a random availability string
	const getRandomAvailability = () => {
		const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
		const randomDay = days[Math.floor(Math.random() * days.length)];
		return `Available ${randomDay} - Fri`;
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	};

	if (loading) {
		return (
			<div className="container mx-auto py-20 px-4 text-center">
				<div className="w-16 h-16 border-4 border-t-[#116aef] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
				<p className="mt-4 text-lg text-gray-600">
					Loading our amazing doctors...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto py-20 px-4 text-center">
				<div className="bg-red-50 p-6 rounded-lg max-w-2xl mx-auto">
					<h2 className="text-2xl font-bold text-red-700 mb-4">
						Oops! Something went wrong
					</h2>
					<p className="text-red-600 mb-4">{error}</p>
					<Button
						onClick={() => window.location.reload()}
						className="bg-[#116aef] hover:bg-[#0f5ed8]"
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gradient-to-b from-white to-blue-50">
			{/* Hero Section */}
			<section className="relative bg-[#116aef] text-white py-20 px-4 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute -right-20 -top-20 w-80 h-80 bg-[#5d9eff] rounded-full"></div>
					<div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#5d9eff] rounded-full"></div>
				</div>
				<div className="container mx-auto relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="max-w-3xl mx-auto text-center"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Meet Our Expert Doctors
						</h1>
						<p className="text-xl opacity-90 mb-8">
							Our team of highly qualified medical professionals is dedicated to
							providing you with the best healthcare experience.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button className="bg-white text-[#116aef] hover:bg-blue-50">
								Book an Appointment
								<Calendar className="ml-2 h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								className="border-white text-[#116aef] hover:bg-white/10"
							>
								Learn More
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Search and Filter Section */}
			<section className="py-10 px-4">
				<div className="container mx-auto">
					<div className="bg-white rounded-xl shadow-lg p-6 -mt-16 relative z-20 border border-gray-100">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<Input
									type="text"
									placeholder="Search by name or specialty..."
									className="pl-10 border-gray-200 focus:border-[#116aef] focus:ring-[#116aef]"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							<div className="w-full md:w-64">
								<Select
									value={selectedSpecialty}
									onValueChange={setSelectedSpecialty}
								>
									<SelectTrigger className="border-gray-200 focus:ring-[#116aef]">
										<SelectValue placeholder="Filter by specialty" />
									</SelectTrigger>
									<SelectContent>
										{specialties.map((specialty) => (
											<SelectItem key={specialty} value={specialty}>
												{specialty}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<Button className="bg-[#116aef] hover:bg-[#0f5ed8]">
								<Filter className="mr-2 h-4 w-4" />
								Filter
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Doctors */}
			<section className="py-16 px-4">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<Badge className="mb-4 bg-blue-100 text-[#116aef] hover:bg-blue-200">
							Our Medical Team
						</Badge>
						<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-4">
							Meet Our Specialists
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Our doctors are board-certified specialists with years of
							experience in their respective fields. They are committed to
							providing personalized care to every patient.
						</p>
					</div>

					{filteredDoctors.length === 0 ? (
						<div className="text-center py-12">
							<div className="bg-blue-50 p-8 rounded-lg max-w-md mx-auto">
								<h3 className="text-xl font-semibold text-[#116aef] mb-2">
									No doctors found
								</h3>
								<p className="text-gray-600 mb-4">
									We couldn&apos;t find any doctors matching your search
									criteria. Please try different filters.
								</p>
								<Button
									onClick={() => {
										setSearchTerm("");
										setSelectedSpecialty("All Specialties");
									}}
									className="bg-[#116aef] hover:bg-[#0f5ed8]"
								>
									Reset Filters
								</Button>
							</div>
						</div>
					) : (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
							variants={containerVariants}
							initial="hidden"
							animate="visible"
						>
							{filteredDoctors.map((doctor) => {
								const rating = getRandomRating();
								const reviews = getRandomReviews();
								const availability = getRandomAvailability();

								return (
									<motion.div
										key={doctor._id}
										variants={itemVariants}
										className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
									>
										<div className="relative h-64 overflow-hidden">
											{doctor.image ? (
												<Image
													src={
														doctor.image ||
														`/placeholder.svg?height=400&width=300&text=Dr.+${
															doctor.fullName.split(" ")[1]
														}`
													}
													alt={doctor.fullName}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											) : (
												<div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-xl">
													{getDoctorsInitials(doctor.fullName)}
												</div>
											)}
											<div className="absolute inset-0 bg-gradient-to-t from-[#032b53]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
												<div className="p-4 w-full">
													<p className="text-white font-medium">
														{availability}
													</p>
												</div>
											</div>
										</div>
										<div className="p-6">
											<div className="flex justify-between items-start mb-2">
												<h3 className="text-xl font-bold text-[#032b53] group-hover:text-[#116aef] transition-colors duration-300">
													Dr. {doctor.fullName}
												</h3>
												<Badge className="bg-blue-100 text-[#116aef] hover:bg-blue-200">
													{doctor.specialty}
												</Badge>
											</div>
											<div className="flex items-center mb-4">
												<div className="flex items-center text-yellow-400 mr-2">
													<Star className="fill-current h-4 w-4" />
													<span className="ml-1 text-sm font-medium">
														{rating}
													</span>
												</div>
												<span className="text-sm text-gray-500">
													({reviews} reviews)
												</span>
											</div>
											<p className="text-gray-600 mb-4">
												{doctor.gender === "Male" ? "He" : "She"} specializes in{" "}
												{doctor.specialty.toLowerCase()}
												and has extensive experience treating patients of all
												ages.
											</p>
											<div className="flex justify-between items-center">
												<Link href={`/book-appointment?doctor=${doctor._id}`}>
													<Button className="bg-[#116aef] hover:bg-[#0f5ed8]">
														Book Appointment
													</Button>
												</Link>
												<Link
													href={`/doctors/${doctor._id}`}
													className="text-[#116aef] hover:text-[#0f5ed8] font-medium flex items-center"
												>
													View Profile
													<ArrowRight className="ml-1 h-4 w-4" />
												</Link>
											</div>
										</div>
									</motion.div>
								);
							})}
						</motion.div>
					)}
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-16 px-4 bg-[#032b53] text-white">
				<div className="container mx-auto">
					<div className="text-center mb-12">
						<Badge className="mb-4 bg-[#116aef]/20 text-white hover:bg-[#116aef]/30">
							Testimonials
						</Badge>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							What Our Patients Say
						</h2>
						<p className="text-white/80 max-w-2xl mx-auto">
							Read what our patients have to say about their experiences with
							our doctors and medical services.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[1, 2, 3].map((index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								viewport={{ once: true }}
								className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
							>
								<div className="flex items-center mb-4">
									<div className="flex text-yellow-400 mr-2">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="fill-current h-4 w-4" />
										))}
									</div>
								</div>
								<p className="italic mb-6">
									{index === 1 &&
										"The doctors here are exceptional. They took the time to listen to my concerns and provided me with the best treatment options."}
									{index === 2 &&
										"I've been a patient here for years, and I've always received top-notch care. The staff is friendly and the doctors are knowledgeable."}
									{index === 3 &&
										"After struggling with my condition for years, Dr. Johnson finally helped me find relief. I'm forever grateful for the care I received."}
								</p>
								<div className="flex items-center">
									<div className="w-12 h-12 rounded-full bg-[#116aef] flex items-center justify-center text-white font-bold mr-4">
										{index === 1 && "JD"}
										{index === 2 && "SM"}
										{index === 3 && "AT"}
									</div>
									<div>
										<h4 className="font-semibold">
											{index === 1 && "Jane Doe"}
											{index === 2 && "Sam Miller"}
											{index === 3 && "Alex Thompson"}
										</h4>
										<p className="text-sm text-white/70">Patient</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<div className="bg-gradient-to-r from-[#116aef] to-[#5d9eff] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

						<div className="relative z-10 max-w-3xl mx-auto text-center text-white">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Ready to Prioritize Your Health?
							</h2>
							<p className="text-xl opacity-90 mb-8">
								Schedule an appointment with one of our specialists today and
								take the first step towards better health.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button className="bg-white text-[#116aef] hover:bg-blue-50">
									Book an Appointment
									<Calendar className="ml-2 h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="border-white text-[#116aef] hover:bg-white/10 hover:text-white"
								>
									Contact Us
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
