"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	Calendar,
	Clock,
	MapPin,
	Phone,
	Mail,
	Star,
	ArrowLeft,
	CheckCircle2,
	Shield,
	Award,
	Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Doctor {
	_id: string;
	fullName: string;
	email: string;
	specialty: string;
	age: number;
	gender: string;
	image?: string;
}

export default function DoctorProfile() {
	const params = useParams();
	const router = useRouter();
	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedTab, setSelectedTab] = useState("about");

	useEffect(() => {
		const fetchDoctor = async () => {
			try {
				const response = await fetch(`/api/doctors/${params.doctorId}`);
				if (!response.ok) {
					if (response.status === 404) {
						throw new Error("Doctor not found");
					}
					throw new Error("Failed to fetch doctor details");
				}
				const data = await response.json();

				console.log(data);

				setDoctor(data);
			} catch (error) {
				console.error("Error fetching doctor:", error);
				setError(
					error instanceof Error ? error.message : "An unknown error occurred"
				);
			} finally {
				setLoading(false);
			}
		};

		if (params.doctorId) {
			fetchDoctor();
		}
	}, [params.doctorId]);

	// Generate random working hours
	const getRandomWorkingHours = () => {
		const startHour = 8 + Math.floor(Math.random() * 2);
		const endHour = 16 + Math.floor(Math.random() * 4);
		return `${startHour}:00 AM - ${endHour - 12}:00 PM`;
	};

	// Generate random years of experience
	const getRandomExperience = () => {
		return 5 + Math.floor(Math.random() * 20);
	};
	const getDoctorsInitials = (fullName: string) => {
		const name = fullName.split(" ");
		if (name.length > 2) {
			return name[0][0] + name[1][0];
		}
		console.log(name[0][0] + name[1][0]);
	};

	// Generate random education
	const getRandomEducation = () => {
		const universities = [
			"Harvard Medical School",
			"Johns Hopkins University",
			"Stanford University School of Medicine",
			"Yale School of Medicine",
			"Mayo Clinic School of Medicine",
		];
		return universities[Math.floor(Math.random() * universities.length)];
	};

	if (loading) {
		return (
			<div className="container mx-auto py-20 px-4 text-center">
				<div className="w-16 h-16 border-4 border-t-[#116aef] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
				<p className="mt-4 text-lg text-gray-600">Loading doctor profile...</p>
			</div>
		);
	}

	if (error || !doctor) {
		return (
			<div className="container mx-auto py-20 px-4 text-center">
				<div className="bg-red-50 p-6 rounded-lg max-w-2xl mx-auto">
					<h2 className="text-2xl font-bold text-red-700 mb-4">
						Oops! Something went wrong
					</h2>
					<p className="text-red-600 mb-4">{error || "Doctor not found"}</p>
					<Button
						onClick={() => router.push("/doctors")}
						className="bg-[#116aef] hover:bg-[#0f5ed8]"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Doctors
					</Button>
				</div>
			</div>
		);
	}

	const experience = getRandomExperience();
	const education = getRandomEducation();
	const workingHours = getRandomWorkingHours();

	return (
		<div className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
			<div className="container mx-auto py-12 px-4">
				<Link
					href="/doctors"
					className="inline-flex items-center text-[#116aef] hover:text-[#0f5ed8] mb-8"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Doctors
				</Link>

				<div className="bg-white rounded-xl shadow-lg overflow-hidden">
					{/* Doctor Header */}
					<div className="bg-gradient-to-r from-[#116aef] to-[#5d9eff] p-8 md:p-12 text-white relative">
						<div className="absolute inset-0 opacity-10">
							<div className="absolute -right-20 -top-20 w-80 h-80 bg-white rounded-full"></div>
							<div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white rounded-full"></div>
						</div>
						<div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
							<div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
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
									<div className="h-full w-full flex items-center justify-center text-gray-700 font-bold text-xl">
										{getDoctorsInitials(doctor.fullName)}
									</div>
								)}
							</div>
							<div>
								<Badge className="mb-2 bg-white/20 hover:bg-white/30">
									{doctor.specialty}
								</Badge>
								<h1 className="text-3xl md:text-4xl font-bold mb-2">
									Dr. {doctor.fullName}
								</h1>
								<div className="flex items-center mb-4">
									<div className="flex items-center text-yellow-300 mr-3">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="fill-current h-4 w-4" />
										))}
									</div>
									<span className="text-white/90">
										({Math.floor(Math.random() * 90) + 10} reviews)
									</span>
								</div>
								<p className="text-white/90 max-w-2xl mb-6">
									Dr. {doctor.fullName} is a highly skilled {doctor.specialty}{" "}
									specialist with {experience} years of experience.
									{doctor.gender === "Male" ? " He " : " She "}
									graduated from {education} and has been providing exceptional
									care to patients ever since.
								</p>
								<div className="flex flex-wrap gap-4">
									<Button className="bg-white text-[#116aef] hover:bg-blue-50">
										<Calendar className="mr-2 h-4 w-4" />
										Book Appointment
									</Button>
									<Button
										variant="outline"
										className="border-white text-white hover:bg-white/10"
									>
										<Phone className="mr-2 h-4 w-4" />
										Contact
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Doctor Info Tabs */}
					<div className="border-b border-gray-200">
						<div className="flex overflow-x-auto">
							{["about", "experience", "reviews", "location"].map((tab) => (
								<button
									key={tab}
									onClick={() => setSelectedTab(tab)}
									className={`px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
										selectedTab === tab
											? "text-[#116aef] border-b-2 border-[#116aef]"
											: "text-gray-600 hover:text-[#116aef]"
									}`}
								>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>
					</div>

					{/* Tab Content */}
					<div className="p-8">
						{selectedTab === "about" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
								className="grid grid-cols-1 md:grid-cols-3 gap-8"
							>
								<div className="md:col-span-2">
									<h2 className="text-2xl font-bold text-[#032b53] mb-4">
										About Dr. {doctor.fullName}
									</h2>
									<p className="text-gray-600 mb-6">
										Dr. {doctor.fullName} is a dedicated {doctor.specialty}{" "}
										specialist who has been practicing for {experience} years.
										{doctor.gender === "Male" ? " He " : " She "}
										received {doctor.gender === "Male" ? "his" : "her"} medical
										degree from {education} and completed
										{doctor.gender === "Male" ? " his " : " her "}
										residency at one of the top medical institutions in the
										country.
									</p>
									<p className="text-gray-600 mb-6">
										With a patient-centered approach to healthcare, Dr.{" "}
										{doctor.fullName.split(" ")[1]} ensures that each patient
										receives personalized care tailored to their specific needs.{" "}
										{doctor.gender === "Male" ? "He" : "She"} stays up-to-date
										with the latest advancements in{" "}
										{doctor.specialty.toLowerCase()} to provide the most
										effective treatments available.
									</p>
									<p className="text-gray-600">
										Dr. {doctor.fullName.split(" ")[1]} is committed to
										improving the quality of life for{" "}
										{doctor.gender === "Male" ? "his" : "her"} patients through
										comprehensive care, education, and preventive strategies.
									</p>

									<div className="mt-8">
										<h3 className="text-xl font-bold text-[#032b53] mb-4">
											Specializations
										</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="flex items-start">
												<CheckCircle2 className="text-[#116aef] h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
												<div>
													<h4 className="font-semibold">
														Advanced {doctor.specialty} Care
													</h4>
													<p className="text-gray-600 text-sm">
														Specialized treatments using the latest techniques
													</p>
												</div>
											</div>
											<div className="flex items-start">
												<CheckCircle2 className="text-[#116aef] h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
												<div>
													<h4 className="font-semibold">Preventive Medicine</h4>
													<p className="text-gray-600 text-sm">
														Proactive approaches to maintain optimal health
													</p>
												</div>
											</div>
											<div className="flex items-start">
												<CheckCircle2 className="text-[#116aef] h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
												<div>
													<h4 className="font-semibold">Patient Education</h4>
													<p className="text-gray-600 text-sm">
														Empowering patients with knowledge for better health
														decisions
													</p>
												</div>
											</div>
											<div className="flex items-start">
												<CheckCircle2 className="text-[#116aef] h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
												<div>
													<h4 className="font-semibold">Holistic Approach</h4>
													<p className="text-gray-600 text-sm">
														Treating the whole person, not just the symptoms
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-blue-50 p-6 rounded-xl">
									<h3 className="text-xl font-bold text-[#032b53] mb-4">
										Doctor Information
									</h3>
									<div className="space-y-4">
										<div className="flex items-center">
											<Shield className="text-[#116aef] h-5 w-5 mr-3" />
											<div>
												<h4 className="font-semibold">Specialty</h4>
												<p className="text-gray-600">{doctor.specialty}</p>
											</div>
										</div>
										<div className="flex items-center">
											<Award className="text-[#116aef] h-5 w-5 mr-3" />
											<div>
												<h4 className="font-semibold">Experience</h4>
												<p className="text-gray-600">{experience} Years</p>
											</div>
										</div>
										<div className="flex items-center">
											<Stethoscope className="text-[#116aef] h-5 w-5 mr-3" />
											<div>
												<h4 className="font-semibold">Education</h4>
												<p className="text-gray-600">{education}</p>
											</div>
										</div>
										<div className="flex items-center">
											<Clock className="text-[#116aef] h-5 w-5 mr-3" />
											<div>
												<h4 className="font-semibold">Working Hours</h4>
												<p className="text-gray-600">{workingHours}</p>
											</div>
										</div>
										<div className="flex items-center">
											<Mail className="text-[#116aef] h-5 w-5 mr-3" />
											<div>
												<h4 className="font-semibold">Email</h4>
												<p className="text-gray-600">{doctor.email}</p>
											</div>
										</div>
									</div>

									<div className="mt-6 pt-6 border-t border-blue-200">
										<Button className="w-full bg-[#116aef] hover:bg-[#0f5ed8]">
											<Calendar className="mr-2 h-4 w-4" />
											Book Appointment
										</Button>
									</div>
								</div>
							</motion.div>
						)}

						{selectedTab === "experience" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<h2 className="text-2xl font-bold text-[#032b53] mb-6">
									Experience & Qualifications
								</h2>

								<div className="space-y-8">
									<div className="border-l-4 border-[#116aef] pl-4">
										<h3 className="text-lg font-semibold">Education</h3>
										<div className="mt-4 space-y-4">
											<div>
												<p className="text-[#116aef] font-medium">
													MD in {doctor.specialty}
												</p>
												<p className="font-semibold">{education}</p>
												<p className="text-gray-600 text-sm">
													{2000 + Math.floor(Math.random() * 10)} -{" "}
													{2004 + Math.floor(Math.random() * 10)}
												</p>
											</div>
											<div>
												<p className="text-[#116aef] font-medium">Residency</p>
												<p className="font-semibold">
													{
														[
															"Mayo Clinic",
															"Cleveland Clinic",
															"Massachusetts General Hospital",
														][Math.floor(Math.random() * 3)]
													}
												</p>
												<p className="text-gray-600 text-sm">
													{2004 + Math.floor(Math.random() * 5)} -{" "}
													{2008 + Math.floor(Math.random() * 5)}
												</p>
											</div>
										</div>
									</div>

									<div className="border-l-4 border-[#5d9eff] pl-4">
										<h3 className="text-lg font-semibold">Work Experience</h3>
										<div className="mt-4 space-y-4">
											<div>
												<p className="text-[#116aef] font-medium">
													Senior {doctor.specialty} Specialist
												</p>
												<p className="font-semibold">MediCare Hospital</p>
												<p className="text-gray-600 text-sm">
													{2015 + Math.floor(Math.random() * 5)} - Present
												</p>
											</div>
											<div>
												<p className="text-[#116aef] font-medium">
													{doctor.specialty} Specialist
												</p>
												<p className="font-semibold">City Medical Center</p>
												<p className="text-gray-600 text-sm">
													{2010 + Math.floor(Math.random() * 5)} -{" "}
													{2015 + Math.floor(Math.random() * 5)}
												</p>
											</div>
										</div>
									</div>

									<div className="border-l-4 border-[#032b53] pl-4">
										<h3 className="text-lg font-semibold">Certifications</h3>
										<div className="mt-4 space-y-4">
											<div>
												<p className="text-[#116aef] font-medium">
													Board Certified in {doctor.specialty}
												</p>
												<p className="text-gray-600 text-sm">
													American Board of {doctor.specialty}
												</p>
											</div>
											<div>
												<p className="text-[#116aef] font-medium">
													Advanced Life Support Certification
												</p>
												<p className="text-gray-600 text-sm">
													American Heart Association
												</p>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						)}

						{selectedTab === "reviews" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold text-[#032b53]">
										Patient Reviews
									</h2>
									<div className="flex items-center">
										<div className="flex items-center text-yellow-400 mr-2">
											{[...Array(5)].map((_, i) => (
												<Star key={i} className="fill-current h-5 w-5" />
											))}
										</div>
										<span className="font-semibold">
											{(4 + Math.random()).toFixed(1)}
										</span>
										<span className="text-gray-500 ml-1">
											({Math.floor(Math.random() * 90) + 10} reviews)
										</span>
									</div>
								</div>

								<div className="space-y-6">
									{[...Array(5)].map((_, i) => {
										const rating = 4 + Math.floor(Math.random() * 2);
										const names = [
											"Sarah Johnson",
											"Michael Brown",
											"Emily Davis",
											"David Wilson",
											"Jennifer Martinez",
										];
										const dates = [
											"2 weeks ago",
											"1 month ago",
											"3 months ago",
											"6 months ago",
											"1 year ago",
										];
										const reviews = [
											"Dr. " +
												doctor.fullName.split(" ")[1] +
												" is an excellent doctor. Very knowledgeable and caring. Took the time to explain everything in detail.",
											"I've been seeing Dr. " +
												doctor.fullName.split(" ")[1] +
												" for years and have always received exceptional care. Highly recommend!",
											"Very professional and thorough. Made me feel comfortable and addressed all my concerns.",
											"Great experience with Dr. " +
												doctor.fullName.split(" ")[1] +
												". " +
												(doctor.gender === "Male" ? "He" : "She") +
												" is attentive and really listens to patients.",
											"Excellent bedside manner and very knowledgeable in " +
												doctor.gender ===
											"Male"
												? "his"
												: "her" + " field. Would definitely recommend.",
										];

										return (
											<div
												key={i}
												className="border-b border-gray-200 pb-6 last:border-0"
											>
												<div className="flex justify-between items-start mb-2">
													<div className="flex items-center">
														<div className="w-10 h-10 rounded-full bg-[#116aef] flex items-center justify-center text-white font-bold mr-3">
															{names[i]
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</div>
														<div>
															<h4 className="font-semibold">{names[i]}</h4>
															<p className="text-gray-500 text-sm">
																{dates[i]}
															</p>
														</div>
													</div>
													<div className="flex text-yellow-400">
														{[...Array(5)].map((_, j) => (
															<Star
																key={j}
																className={`h-4 w-4 ${
																	j < rating ? "fill-current" : ""
																}`}
															/>
														))}
													</div>
												</div>
												<p className="text-gray-600">{reviews[i]}</p>
											</div>
										);
									})}
								</div>
							</motion.div>
						)}

						{selectedTab === "location" && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<h2 className="text-2xl font-bold text-[#032b53] mb-6">
									Location & Contact
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div>
										<div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center mb-4">
											<MapPin className="h-12 w-12 text-[#116aef]" />
											<span className="ml-2 text-gray-600">
												Map placeholder
											</span>
										</div>

										<div className="space-y-4">
											<div className="flex items-start">
												<MapPin className="text-[#116aef] h-5 w-5 mt-0.5 mr-2" />
												<div>
													<h4 className="font-semibold">Address</h4>
													<p className="text-gray-600">
														123 Medical Center Drive, Suite 456
													</p>
													<p className="text-gray-600">New York, NY 10001</p>
												</div>
											</div>

											<div className="flex items-start">
												<Phone className="text-[#116aef] h-5 w-5 mt-0.5 mr-2" />
												<div>
													<h4 className="font-semibold">Phone</h4>
													<p className="text-gray-600">(123) 456-7890</p>
												</div>
											</div>

											<div className="flex items-start">
												<Mail className="text-[#116aef] h-5 w-5 mt-0.5 mr-2" />
												<div>
													<h4 className="font-semibold">Email</h4>
													<p className="text-gray-600">{doctor.email}</p>
												</div>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-xl font-bold text-[#032b53] mb-4">
											Working Hours
										</h3>
										<div className="space-y-3">
											{[
												"Monday",
												"Tuesday",
												"Wednesday",
												"Thursday",
												"Friday",
											].map((day) => (
												<div
													key={day}
													className="flex justify-between items-center pb-2 border-b border-gray-200"
												>
													<span className="font-medium">{day}</span>
													<span className="text-gray-600">{workingHours}</span>
												</div>
											))}
											<div className="flex justify-between items-center pb-2 border-b border-gray-200">
												<span className="font-medium">Saturday</span>
												<span className="text-gray-600">9:00 AM - 1:00 PM</span>
											</div>
											<div className="flex justify-between items-center pb-2 border-b border-gray-200">
												<span className="font-medium">Sunday</span>
												<span className="text-gray-600 font-medium text-[#116aef]">
													Closed
												</span>
											</div>
										</div>

										<div className="mt-8">
											<Button className="w-full bg-[#116aef] hover:bg-[#0f5ed8]">
												<Calendar className="mr-2 h-4 w-4" />
												Book Appointment
											</Button>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
