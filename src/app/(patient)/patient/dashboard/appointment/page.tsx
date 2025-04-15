"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function BookAppointmentPage() {
	const [symptoms, setSymptoms] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessPopup, setShowSuccessPopup] = useState(false);
	const [showErrorPopup, setShowErrorPopup] = useState(false);
	const { userData } = useUser();

	const handleSubmitSymptoms = async () => {
		if (!symptoms) {
			toast.error(
				"Please describe your symptoms or reason for the appointment."
			);
			return;
		}

		if (!userData?._id) {
			toast.error("User data is not available. Please log in and try again.");
			return;
		}

		setIsLoading(true);

		try {
			const appointmentRequest = {
				userId: userData._id,
				symptoms,
			};

			const response = await fetch("/api/appointment-request", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(appointmentRequest),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`HTTP error! status: ${response.status}, body: ${errorText}`
				);
			}

			const data = await response.json();

			setShowSuccessPopup(true);
			setTimeout(() => setShowSuccessPopup(false), 3000);
			setSymptoms("");
		} catch (error) {
			setShowErrorPopup(true);
			setTimeout(() => setShowErrorPopup(false), 3000);
			console.error(
				"An error occurred while submitting your appointment request:",
				error
			);
			toast.error(
				`Error: ${error instanceof Error ? error.message : String(error)}`
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-6 bg-white h-full rounded-lg shadow-lg mx-auto">
			<h1 className="text-3xl font-bold mb-8 text-[#116aef]">
				Request an Appointment
			</h1>

			<div className="space-y-6">
				<div>
					<label
						htmlFor="symptoms"
						className="block text-lg font-medium text-gray-700 mb-2"
					>
						Describe Your Symptoms
					</label>
					<Textarea
						id="symptoms"
						value={symptoms}
						onChange={(e) => setSymptoms(e.target.value)}
						placeholder="Please describe your symptoms or reason for the appointment in detail. This will help us assign the most appropriate doctor for your needs."
						className="w-full min-h-[200px]"
					/>
				</div>
				<Button
					onClick={handleSubmitSymptoms}
					className="w-full bg-[#116aef] hover:bg-[#0f5ed8] text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
					disabled={isLoading}
				>
					{isLoading ? "Submitting..." : "Submit Appointment Request"}
				</Button>
			</div>
			<Toaster
				position="top-right"
				toastOptions={{
					duration: 3000,
					style: {
						background: "#333",
						color: "#fff",
					},
				}}
			/>
			<AnimatePresence>
				{showSuccessPopup && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center"
					>
						<CheckCircle className="mr-2" />
						Appointment request submitted successfully!
					</motion.div>
				)}
				{showErrorPopup && (
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -50 }}
						className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center"
					>
						<XCircle className="mr-2" />
						An error occurred. Please try again.
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
