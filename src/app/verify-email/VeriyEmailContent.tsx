"use client";

import "@/app/(root)/globals.css";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function VerifyEmailContent() {
	const [verificationStatus, setVerificationStatus] = useState<
		"verifying" | "success" | "error"
	>("verifying");
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	useEffect(() => {
		const verifyEmail = async () => {
			if (!token) {
				setVerificationStatus("error");
				return;
			}

			try {
				const response = await fetch("/api/users/verify-email", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				});

				const data = await response.json();

				if (data.success) {
					setVerificationStatus("success");
					setTimeout(() => router.push("/login"), 5000);
				} else {
					setVerificationStatus("error");
				}
			} catch (error) {
				console.error("Verification error:", error);
				setVerificationStatus("error");
			}
		};

		verifyEmail();
	}, [token, router]);

	const statusConfig = {
		verifying: {
			icon: Loader,
			title: "Verifying Your Email",
			message: "Please wait while we verify your email address...",
			color: "text-blue-500",
		},
		success: {
			icon: CheckCircle,
			title: "Email Verified Successfully!",
			message: "You will be redirected to the login page in 5 seconds.",
			color: "text-green-500",
		},
		error: {
			icon: XCircle,
			title: "Verification Failed",
			message:
				"There was an error verifying your email. Please try again or contact support.",
			color: "text-red-500",
		},
	};

	const currentStatus = statusConfig[verificationStatus];

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4">
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
				className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
			>
				<motion.div
					initial={{ y: -50 }}
					animate={{ y: 0 }}
					transition={{
						delay: 0.2,
						type: "spring",
						stiffness: 260,
						damping: 20,
					}}
				>
					<currentStatus.icon
						className={`w-16 h-16 mx-auto ${currentStatus.color} mb-4`}
					/>
				</motion.div>
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="text-2xl font-bold mb-4 text-gray-800"
				>
					{currentStatus.title}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="text-gray-600 mb-6"
				>
					{currentStatus.message}
				</motion.p>
				{verificationStatus === "error" && (
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						onClick={() => router.push("/login")}
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
					>
						Return to Login
					</motion.button>
				)}
			</motion.div>
		</div>
	);
}
