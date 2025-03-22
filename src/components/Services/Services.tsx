"use client";
import Image from "next/image";
import Service from "./Service";
import { motion } from "framer-motion";

const Services = () => {
	const services = [
		{
			icon: "icofont-ambulance-cross",
			p: "Emergency Help Services Regardless Of The Emergency Severity",
			h3: "24/7 Ready Emergency Help Services",
		},
		{
			icon: "icofont-medical-sign-alt",
			p: "Expert Services With Access To The Best Medical Apparatus",
			h3: "Top Health Care Services With Us",
		},
		{
			icon: "icofont-stethoscope",
			p: "Affordable and Tailored Health Care Services",
			h3: "Affordable Health Care Services",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	};

	return (
		<section className="py-20 lg:mt-[19rem] bg-gradient-to-b from-white to-blue-50">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-4">
						We Are Always Ready to Help You & Your Family
					</h2>
					<div className="flex justify-center mb-4">
						<Image
							src="/section-img.png"
							alt="services"
							height={50}
							width={50}
							className="max-w-full h-auto w-auto"
						/>
					</div>
					<p className="text-gray-600 max-w-2xl mx-auto">
						We Offer amazing Health Care Services You Can Trust
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{services.map(({ icon, p, h3 }, index) => (
						<motion.div key={index} variants={itemVariants}>
							<Service
								icon={icon}
								h3={h3}
								p={p}
								last={index === 2 ? "none" : ""}
							/>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default Services;
