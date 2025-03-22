"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
	CheckCircle,
	Calendar,
	Upload,
	User,
	Briefcase,
	MapPin,
	Phone,
	Mail,
	Lock,
	Loader2,
	ArrowLeft,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import Image from "next/image";

const specialties = [
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

const genders = ["Male", "Female", "Other"];

export default function AddDoctor() {
	const [activeStep, setActiveStep] = useState(0);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [bio, setBio] = useState("");
	const [education, setEducation] = useState("");
	const [experience, setExperience] = useState("");
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);
	const router = useRouter();

	const steps = [
		{ id: 0, name: "Basic Information" },
		{ id: 1, name: "Personal Details" },
		{ id: 2, name: "Professional Info" },
	];

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Check file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			toast.error("Image size should not exceed 5MB");
			return;
		}

		// Check file type
		const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
		if (!validTypes.includes(file.type)) {
			toast.error(
				"Invalid file type. Only JPEG, PNG, and WebP images are allowed."
			);
			return;
		}

		setProfileImage(file);

		// Preview the image
		const reader = new FileReader();
		reader.onload = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const validateBasicInfo = () => {
		if (!fullName) {
			toast.error("Please enter full name");
			return false;
		}
		if (!email) {
			toast.error("Please enter email");
			return false;
		}
		if (!password) {
			toast.error("Please enter password");
			return false;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return false;
		}
		return true;
	};

	const validatePersonalInfo = () => {
		if (!specialty) {
			toast.error("Please select specialty");
			return false;
		}
		if (!age) {
			toast.error("Please enter age");
			return false;
		}
		if (!gender) {
			toast.error("Please select gender");
			return false;
		}
		if (!dateOfBirth) {
			toast.error("Please select date of birth");
			return false;
		}
		return true;
	};

	const handleNextStep = () => {
		if (activeStep === 0 && validateBasicInfo()) {
			setActiveStep(1);
		} else if (activeStep === 1 && validatePersonalInfo()) {
			setActiveStep(2);
		}
	};

	const handlePrevStep = () => {
		if (activeStep > 0) {
			setActiveStep(activeStep - 1);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateBasicInfo() || !validatePersonalInfo()) {
			return;
		}

		setIsLoading(true);

		try {
			// If we have a profile image, use FormData
			if (profileImage) {
				const formData = new FormData();
				formData.append("fullName", fullName);
				formData.append("email", email);
				formData.append("password", password);
				formData.append("specialty", specialty);
				formData.append("age", age);
				formData.append("gender", gender);
				formData.append("dateOfBirth", dateOfBirth?.toISOString() || "");
				formData.append("phone", phone || "");
				formData.append("address", address || "");
				formData.append("bio", bio || "");
				formData.append("education", education || "");
				formData.append("experience", experience || "");
				formData.append("profileImage", profileImage);

				const response = await fetch("/api/doctors/add-doctor", {
					method: "POST",
					body: formData,
				});

				const data = await response.json();

				if (response.ok) {
					handleSuccess();
				} else {
					handleError(data);
				}
			} else {
				// If no profile image, use JSON
				const doctorData = {
					fullName,
					email,
					password,
					specialty,
					age: Number(age),
					gender,
					dateOfBirth: dateOfBirth?.toISOString(),
					phone: phone || undefined,
					address: address || undefined,
					bio: bio || undefined,
					education: education || undefined,
					experience: experience || undefined,
				};

				const response = await fetch("/api/doctors/add-doctor", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(doctorData),
				});

				const data = await response.json();

				if (response.ok) {
					handleSuccess();
				} else {
					handleError(data);
				}
			}
		} catch (error) {
			console.error("Error adding doctor:", error);
			toast.error(
				"An error occurred while adding the doctor. Please check the console for more details."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuccess = () => {
		setShowSuccessPopup(true);
		setTimeout(() => {
			setShowSuccessPopup(false);
			router.push("/admin/dashboard/doctors");
		}, 3000);

		// Reset form fields
		setFullName("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setSpecialty("");
		setAge("");
		setGender("");
		setDateOfBirth(null);
		setPhone("");
		setAddress("");
		setBio("");
		setEducation("");
		setExperience("");
		setProfileImage(null);
		setImagePreview(null);
	};

	const handleError = (data: any) => {
		console.error("Failed to add doctor:", data);
		toast.error(`Failed to add doctor: ${data.error || "Unknown error"}`);
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center mb-6">
					<Link href="/admin/dashboard/doctors" className="mr-4">
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Add New Doctor</h1>
						<p className="text-gray-500 mt-1">
							Create a new doctor profile in the system
						</p>
					</div>
				</div>

				<Card className="border-gray-100 shadow-lg">
					<div className="border-b border-gray-100">
						<div className="flex">
							{steps.map((step, index) => (
								<div
									key={step.id}
									className={`flex-1 text-center py-4 px-2 cursor-pointer transition-colors ${
										activeStep === index
											? "bg-[#116aef] text-white"
											: "bg-gray-50 text-gray-600 hover:bg-gray-100"
									} ${index === 0 ? "rounded-tl-lg" : ""} ${
										index === steps.length - 1 ? "rounded-tr-lg" : ""
									}`}
									onClick={() => {
										if (index < activeStep) {
											setActiveStep(index);
										} else if (
											index === 1 &&
											activeStep === 0 &&
											validateBasicInfo()
										) {
											setActiveStep(1);
										} else if (
											index === 2 &&
											activeStep === 1 &&
											validatePersonalInfo()
										) {
											setActiveStep(2);
										}
									}}
								>
									<div className="flex items-center justify-center">
										<div
											className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
												activeStep === index
													? "bg-white text-[#116aef]"
													: "bg-gray-200 text-gray-600"
											}`}
										>
											{index + 1}
										</div>
										<span className="hidden sm:inline">{step.name}</span>
									</div>
								</div>
							))}
						</div>
					</div>

					<CardContent className="pt-6">
						<form onSubmit={handleSubmit}>
							{activeStep === 0 && (
								<div className="space-y-6">
									<div className="flex items-center justify-center">
										<div className="relative group">
											<div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
												{imagePreview ? (
													<Image
														width={50}
														height={50}
														src={imagePreview || "/placeholder.svg"}
														alt="Profile Preview"
														className="w-full h-full object-cover"
													/>
												) : (
													<User className="h-12 w-12 text-gray-400" />
												)}
											</div>
											<div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
												<Upload className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
											</div>
											<input
												type="file"
												className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
												onChange={handleImageChange}
												accept="image/png, image/jpeg, image/jpg, image/webp"
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label htmlFor="fullName" className="text-gray-700">
												<User className="h-4 w-4 inline mr-2" />
												Full Name
											</Label>
											<Input
												id="fullName"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												placeholder="Dr. John Doe"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email" className="text-gray-700">
												<Mail className="h-4 w-4 inline mr-2" />
												Email Address
											</Label>
											<Input
												id="email"
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												placeholder="doctor@example.com"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="password" className="text-gray-700">
												<Lock className="h-4 w-4 inline mr-2" />
												Password
											</Label>
											<Input
												id="password"
												type="password"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												placeholder="••••••••"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
										<div className="space-y-2">
											<Label
												htmlFor="confirmPassword"
												className="text-gray-700"
											>
												<Lock className="h-4 w-4 inline mr-2" />
												Confirm Password
											</Label>
											<Input
												id="confirmPassword"
												type="password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												placeholder="••••••••"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
									</div>

									<div className="flex justify-end">
										<Button
											type="button"
											onClick={handleNextStep}
											className="bg-[#116aef] hover:bg-[#0f5ed8] text-white"
										>
											Next
										</Button>
									</div>
								</div>
							)}

							{activeStep === 1 && (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label htmlFor="specialty" className="text-gray-700">
												<Briefcase className="h-4 w-4 inline mr-2" />
												Specialty
											</Label>
											<Select value={specialty} onValueChange={setSpecialty}>
												<SelectTrigger className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]">
													<SelectValue placeholder="Select Specialty" />
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
										<div className="space-y-2">
											<Label htmlFor="gender" className="text-gray-700">
												<User className="h-4 w-4 inline mr-2" />
												Gender
											</Label>
											<Select value={gender} onValueChange={setGender}>
												<SelectTrigger className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]">
													<SelectValue placeholder="Select Gender" />
												</SelectTrigger>
												<SelectContent>
													{genders.map((g) => (
														<SelectItem key={g} value={g}>
															{g}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="age" className="text-gray-700">
												<User className="h-4 w-4 inline mr-2" />
												Age
											</Label>
											<Input
												id="age"
												type="number"
												min="18"
												max="100"
												value={age}
												onChange={(e) => setAge(e.target.value)}
												placeholder="35"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="dateOfBirth" className="text-gray-700">
												<Calendar className="h-4 w-4 inline mr-2" />
												Date of Birth
											</Label>
											<div className="border border-gray-300 rounded-md">
												<DatePicker
													selected={dateOfBirth}
													onChange={(date: Date | null) => setDateOfBirth(date)}
													dateFormat="MMMM d, yyyy"
													showYearDropdown
													scrollableYearDropdown
													yearDropdownItemNumber={100}
													placeholderText="Select date of birth"
													className="w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#116aef]"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="phone" className="text-gray-700">
												<Phone className="h-4 w-4 inline mr-2" />
												Phone Number
											</Label>
											<Input
												id="phone"
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												placeholder="+1 (555) 123-4567"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="address" className="text-gray-700">
												<MapPin className="h-4 w-4 inline mr-2" />
												Address
											</Label>
											<Input
												id="address"
												value={address}
												onChange={(e) => setAddress(e.target.value)}
												placeholder="123 Medical Center Dr, City, State"
												className="border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
											/>
										</div>
									</div>

									<div className="flex justify-between">
										<Button
											type="button"
											onClick={handlePrevStep}
											variant="outline"
										>
											Previous
										</Button>
										<Button
											type="button"
											onClick={handleNextStep}
											className="bg-[#116aef] hover:bg-[#0f5ed8] text-white"
										>
											Next
										</Button>
									</div>
								</div>
							)}

							{activeStep === 2 && (
								<div className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor="bio" className="text-gray-700">
											Professional Bio
										</Label>
										<Textarea
											id="bio"
											value={bio}
											onChange={(e) => setBio(e.target.value)}
											placeholder="Brief professional biography"
											className="min-h-[100px] border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="education" className="text-gray-700">
											Education
										</Label>
										<Textarea
											id="education"
											value={education}
											onChange={(e) => setEducation(e.target.value)}
											placeholder="Educational background and qualifications"
											className="min-h-[100px] border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="experience" className="text-gray-700">
											Work Experience
										</Label>
										<Textarea
											id="experience"
											value={experience}
											onChange={(e) => setExperience(e.target.value)}
											placeholder="Previous work experience"
											className="min-h-[100px] border-gray-300 focus:border-[#116aef] focus:ring-[#116aef]"
										/>
									</div>

									<div className="flex justify-between">
										<Button
											type="button"
											onClick={handlePrevStep}
											variant="outline"
										>
											Previous
										</Button>
										<Button
											type="submit"
											className="bg-[#116aef] hover:bg-[#0f5ed8] text-white"
											disabled={isLoading}
										>
											{isLoading ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Adding Doctor...
												</>
											) : (
												"Add Doctor"
											)}
										</Button>
									</div>
								</div>
							)}
						</form>
					</CardContent>
				</Card>
			</div>

			<Toaster position="top-right" />

			<AnimatePresence>
				{showSuccessPopup && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center z-50"
					>
						<CheckCircle className="mr-2" />
						Doctor added successfully!
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
