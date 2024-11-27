"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Stethoscope } from "lucide-react";

const LOADING_DURATION = 5000;

const LoadingIcon = ({
	icon: Icon,
	delay,
}: {
	icon: React.ElementType;
	delay: number;
}) => (
	<motion.div
		initial={{ scale: 0, opacity: 0 }}
		animate={{ scale: 1, opacity: 1 }}
		transition={{ delay, duration: 0.5 }}
		className="text-white"
	>
		<Icon size={40} />
	</motion.div>
);

const PulseEffect = () => (
	<motion.div
		className="absolute inset-0 bg-blue-500 rounded-full"
		initial={{ scale: 0.5, opacity: 0.5 }}
		animate={{ scale: 1.5, opacity: 0 }}
		transition={{ duration: 1.5, repeat: Infinity }}
	/>
);

const ProgressBar = ({ progress }: { progress: number }) => (
	<div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mt-6">
		<motion.div
			className="h-full bg-white"
			initial={{ width: 0 }}
			animate={{ width: `${progress}%` }}
			transition={{ duration: 0.5, ease: "easeInOut" }}
		/>
	</div>
);

export default function ProtectedRoute() {
	const { userData, isLoading, error } = useUser();
	const [progress, setProgress] = useState(0);
	const [showLoading, setShowLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (showLoading) {
			timer = setInterval(() => {
				setProgress((prevProgress) => {
					if (prevProgress >= 100) {
						clearInterval(timer);
						return 100;
					}
					return prevProgress + 1;
				});
			}, LOADING_DURATION / 100);
		}
		return () => clearInterval(timer);
	}, [showLoading]);

	useEffect(() => {
		if (progress === 100 && !isLoading) {
			const redirectTimer = setTimeout(() => {
				setShowLoading(false);
				if (userData) {
					switch (userData.role) {
						case "admin":
							router.push("/admin/dashboard");
							break;
						case "doctor":
							router.push("/doctor/dashboard");
							break;
						case "patient":
							router.push("/patient/dashboard");
							break;
						default:
							router.push("/login");
					}
				} else {
					router.push("/login");
				}
			}, 500); // Small delay after progress completes
			return () => clearTimeout(redirectTimer);
		}
	}, [progress, isLoading, userData, router]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (showLoading) {
		return (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden"
				>
					<div className="relative z-10 flex flex-col items-center">
						<div className="flex space-x-4 mb-6">
							<LoadingIcon icon={Heart} delay={0} />
							<LoadingIcon icon={Activity} delay={0.2} />
							<LoadingIcon icon={Stethoscope} delay={0.4} />
						</div>

						<motion.h2
							className="text-3xl font-bold text-white mb-2"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
						>
							Loading Your Health Dashboard
						</motion.h2>

						<motion.p
							className="text-white text-opacity-80 mb-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.7 }}
						>
							Preparing your personalized health information...
						</motion.p>

						<ProgressBar progress={progress} />
					</div>
				</motion.div>
			</AnimatePresence>
		);
	}

	return null;
}
