"use client";

import "@/app/(root)/globals.css";
import Link from "next/link";
import { useState } from "react";
import { Home, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons/icon";
import SideImg from "@/components/ui/sideImg";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { PasswordRequirements } from "@/components/ui/PasswordRequirement";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function SignUpPage() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
		phoneNumber: "",
		age: "",
		gender: "",
	});

	const {
		fullName,
		email,
		password,
		confirmPassword,
		phoneNumber,
		age,
		gender,
	} = formData;
	const router = useRouter();

	const steps = [
		{ number: 1, title: "Personal Info" },
		{ number: 2, title: "Contact Details" },
		{ number: 3, title: "Password" },
	];

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handlePhoneChange = (value: string | undefined) => {
		setFormData((prevData) => ({
			...prevData,
			phoneNumber: value || "",
		}));
	};

	const handleGenderChange = (value: string) => {
		setFormData((prevData) => ({
			...prevData,
			gender: value,
		}));
	};

	const nextStep = () => {
		setCurrentStep((prev) => Math.min(prev + 1, 3));
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			setIsLoading(false);
			return;
		}

		try {
			const response = await axios.post("/api/users/signup", {
				fullName,
				email,
				password,
				phoneNumber,
				age,
				gender,
			});

			if (response.data.success) {
				toast.success("Account created successfully");
				router.push("/verification-sent-successful");
			} else {
				toast.error(response.data.error || "Failed to create account");
			}
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || "An error occurred during registration"
			);
		} finally {
			setIsLoading(false);
		}
	}

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="fullName" className="text-gray-300">
								Full Name
							</Label>
							<Input
								id="fullName"
								name="fullName"
								placeholder="Your Full Name"
								value={fullName}
								onChange={handleFormChange}
								type="text"
								autoCapitalize="words"
								autoComplete="name"
								disabled={isLoading}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="age" className="text-gray-300">
								Age
							</Label>
							<Input
								id="age"
								name="age"
								placeholder="Your Age"
								value={age}
								onChange={handleFormChange}
								type="number"
								min="0"
								max="150"
								disabled={isLoading}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="gender" className="text-gray-300">
								Gender
							</Label>
							<Select onValueChange={handleGenderChange} value={gender}>
								<SelectTrigger className="bg-[#428ed66c] text-white border-none">
									<SelectValue placeholder="Select Gender" />
								</SelectTrigger>
								<SelectContent className="bg-white text-[#116aef]">
									<SelectItem value="male">Male</SelectItem>
									<SelectItem value="female">Female</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</motion.div>
				);
			case 2:
				return (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-300">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								placeholder="name@example.com"
								type="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								disabled={isLoading}
								value={email}
								onChange={handleFormChange}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phoneNumber" className="text-gray-300">
								Phone Number
							</Label>
							<PhoneInput
								international
								countryCallingCodeEditable={false}
								defaultCountry="US"
								value={phoneNumber}
								onChange={handlePhoneChange}
								disabled={isLoading}
								inputComponent={Input}
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
					</motion.div>
				);
			case 3:
				return (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-300">
								Password
							</Label>
							<Input
								id="password"
								name="password"
								placeholder="Your password"
								value={password}
								onChange={handleFormChange}
								type="password"
								autoCapitalize="none"
								autoComplete="new-password"
								disabled={isLoading}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
							<PasswordRequirements password={password} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-gray-300">
								Confirm Password
							</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={handleFormChange}
								type="password"
								autoCapitalize="none"
								autoComplete="new-password"
								disabled={isLoading}
								required
								className="bg-[#428ed66c] input-phone text-white placeholder-gray-400"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="terms" required />
							<label
								htmlFor="terms"
								className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Accept terms and conditions
							</label>
						</div>
					</motion.div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex min-h-screen bg-[#2272bd]">
			<div className="hidden lg:block lg:w-1/2 relative">
				<SideImg img="/img/register.jpg" />
			</div>
			<div className="flex-1 flex flex-col justify-center px-4 py-12 lg:px-8 lg:w-1/2">
				<main className="w-full max-w-md mx-auto">
					<div className="absolute top-0 right-0 p-4 lg:hidden">
						<Link href="/" aria-label="Go to home page">
							<Home className="text-white" />
						</Link>
					</div>
					<div className="space-y-6">
						<motion.div
							className="space-y-2 text-center"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h1 className="text-3xl font-semibold tracking-tight text-white">
								Create Your Account
							</h1>
							<p className="text-sm text-white/80">
								Step {currentStep} of 3:{" "}
								{steps.find((s) => s.number === currentStep)?.title}
							</p>
						</motion.div>

						<div className="flex justify-between mb-8">
							{steps.map((step) => (
								<div key={step.number} className="flex flex-col items-center">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
											step.number === currentStep
												? "bg-white text-blue-600"
												: step.number < currentStep
												? "bg-green-500 text-white"
												: "bg-white/20 text-white"
										}`}
									>
										{step.number < currentStep ? (
											<CheckCircle2 className="w-5 h-5" />
										) : (
											step.number
										)}
									</div>
									<div className="text-xs mt-2 text-white/80">{step.title}</div>
								</div>
							))}
						</div>

						<form onSubmit={onSubmit} className="space-y-4">
							{renderStepContent()}

							<div className="flex justify-between mt-6">
								{currentStep > 1 && (
									<Button
										type="button"
										onClick={prevStep}
										variant="outline"
										className="bg-transparent border-white text-white hover:bg-white/10"
									>
										Back
									</Button>
								)}
								{currentStep < 3 ? (
									<Button
										type="button"
										onClick={nextStep}
										className="bg-white text-blue-600 hover:bg-white/90 ml-auto"
									>
										Next
										<ChevronRight className="w-4 h-4 ml-2" />
									</Button>
								) : (
									<Button
										type="submit"
										className="bg-white text-blue-600 hover:bg-white/90 ml-auto"
										disabled={isLoading}
									>
										{isLoading ? (
											<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
										) : (
											"Create Account"
										)}
									</Button>
								)}
							</div>
						</form>

						<div className="text-center text-sm text-white/80">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-white underline underline-offset-4 hover:text-white/90"
							>
								Login
							</Link>
						</div>
					</div>
				</main>
				<Toaster position="top-center" />
			</div>
		</div>
	);
}
