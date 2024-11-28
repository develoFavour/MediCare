"use client";

import "@/app/(root)/globals.css";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function VerificationSent() {
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
					<CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
				</motion.div>
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="text-2xl font-bold mb-4 text-gray-800"
				>
					Verification Email Sent!
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="text-gray-600 mb-6"
				>
					Please check your mailbox to verify your account. The verification
					link will expire in 1 hour.
				</motion.p>
			</motion.div>
		</div>
	);
}
