"use client";

import "@/app/(root)/globals.css";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function VerifyEmailContent() {
	const [verificationStatus, setVerificationStatus] = useState<
		"verifying" | "success" | "error" | "already-verified"
	>("verifying");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const userId = searchParams.get("userId");
	const verificationAttempted = useRef(false);

	useEffect(() => {
		const verifyEmail = async () => {
			// Prevent multiple verification attempts
			if (verificationAttempted.current) {
				return;
			}

			verificationAttempted.current = true;

			if (!token || !userId) {
				setVerificationStatus("error");
				setErrorMessage("Missing verification parameters");
				return;
			}

			try {
				const response = await fetch("/api/users/verify-email", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token, userId }),
				});

				const data = await response.json();

				if (data.success) {
					setVerificationStatus("success");
					setTimeout(() => router.push("/login"), 5000);
				} else if (
					data.error === "Invalid or expired token" &&
					data.alreadyVerified
				) {
					// Handle already verified case
					setVerificationStatus("already-verified");
					setTimeout(() => router.push("/login"), 5000);
				} else {
					setVerificationStatus("error");
					setErrorMessage(data.error || "Verification failed");
				}
			} catch (error) {
				console.error("Verification error:", error);
				setVerificationStatus("error");
				setErrorMessage("An unexpected error occurred");
			}
		};

		verifyEmail();
	}, [token, userId, router]);

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
		"already-verified": {
			icon: CheckCircle,
			title: "Email Already Verified!",
			message:
				"Your email has already been verified. Redirecting to login page...",
			color: "text-green-500",
		},
		error: {
			icon: XCircle,
			title: "Verification Failed",
			message:
				errorMessage ||
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
						className={`w-16 h-16 mx-auto ${currentStatus.color} mb-4 ${
							verificationStatus === "verifying" ? "animate-spin" : ""
						}`}
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
