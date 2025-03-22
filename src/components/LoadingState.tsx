"use client";

import { motion } from "framer-motion";
import { Stethoscope, User, Calendar, Activity } from "lucide-react";

export default function LoadingState() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh]">
			<motion.div
				className="relative"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
			>
				<div className="w-24 h-24 border-4 border-gray-100 rounded-full flex items-center justify-center bg-white shadow-md">
					<Stethoscope className="h-10 w-10 text-[#116aef]" />
				</div>
				<motion.div
					className="w-24 h-24 border-4 border-t-[#116aef] border-r-[#116aef] rounded-full absolute top-0 left-0"
					animate={{ rotate: 360 }}
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: "linear",
					}}
				/>
			</motion.div>

			<motion.h3
				className="mt-6 text-xl font-semibold text-gray-800"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.5 }}
			>
				Loading
			</motion.h3>

			<motion.p
				className="mt-2 text-gray-500"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, duration: 0.5 }}
			>
				Please wait while we fetch the latest data
			</motion.p>

			<div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
				{[
					{ icon: User, label: "Doctors" },
					{ icon: Calendar, label: "Appointments" },
					{ icon: Activity, label: "Specialties" },
				].map((item, i) => (
					<motion.div
						key={i}
						className="flex flex-col items-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
					>
						<div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
							<item.icon className="h-6 w-6 text-[#116aef]" />
						</div>
						<div className="h-2 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
						<div className="h-2 bg-gray-200 rounded w-10 animate-pulse"></div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
