import Image from "next/image";
import React from "react";
import FloatingParticle from "./FloatingParticle";
import { motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
interface ImageProps {
	img: string;
}

const SideImg = ({ img }: ImageProps) => {
	const pathname = usePathname();
	const welcomeText = pathname.startsWith("/login");
	return (
		<div
			className={
				welcomeText
					? "relative  overflow-hidden bg-gradient-to-br from-teal-500/20 to-teal-600/40 lg:w-1/2"
					: "fixed top-0 left-0 h-screen lg:w-1/2 bg-gradient-to-br from-teal-500/20 to-teal-600/40"
			}
		>
			<Image
				src={img}
				alt="Healthcare illustration"
				width={800}
				height={600}
				className="h-full w-full object-cover opacity-70"
			/>
			{[...Array(10)].map((_, i) => (
				<FloatingParticle key={i} delay={i * 0.5} />
			))}
			<motion.div
				className="absolute bottom-24 left-8 text-4xl font-bold text-white drop-shadow-lg"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 1 }}
			>
				{welcomeText ? "Welcome to MediCare" : "Join MediCare Today"}
			</motion.div>
			<motion.p
				className="absolute bottom-14 left-8 max-w-md text-sm text-white/90 drop-shadow"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 1 }}
			>
				Join our platform to access cutting-edge healthcare services and connect
				with top professionals in the field.
			</motion.p>
		</div>
	);
};

export default SideImg;
