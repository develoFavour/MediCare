import React from "react";
import { motion } from "framer-motion";

const Preloader = () => {
	return (
		<motion.div
			className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-primary-blue z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="relative">
				<motion.div
					className="w-16 h-16 border-4 border-blue-200 rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
				></motion.div>
				<motion.div
					className="w-16 h-16 border-4 border-blue-500 rounded-full absolute top-0 left-0 border-t-transparent"
					animate={{ rotate: 360 }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
				></motion.div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<svg width="16px" height="12px">
						<motion.polyline
							id="back"
							points="1 6 4 6 6 11 10 1 12 6 15 6"
							fill="none"
							stroke="#e0e0e0"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						></motion.polyline>
						<motion.polyline
							id="front"
							points="1 6 4 6 6 11 10 1 12 6 15 6"
							fill="none"
							stroke="#3b82f6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						></motion.polyline>
					</svg>
				</div>
			</div>
		</motion.div>
	);
};

export default Preloader;
