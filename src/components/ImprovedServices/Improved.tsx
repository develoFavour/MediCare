"use client";
import Image from "next/image";
import ImprovedServices from "./ImprovedServices";
import { motion } from "framer-motion";

const Improved = () => {
	const improvedServices = [
		{
			title: "General Treatment",
			ico: "icofont-prescription",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Teeth Whitening",
			ico: "icofont-tooth",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Heart Surgery",
			ico: "icofont-heart-alt",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Ear Treatment",
			ico: " icofont-listening",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Vision Problems",
			ico: "icofont-eye-alt",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Blood Transfusion",
			ico: "icofont-blood",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<section className="py-20 bg-gradient-to-b from-blue-50 to-white">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-4">
						We Offer Different Services To Improve Your Health
					</h2>
					<div className="flex justify-center mb-4">
						<Image
							src="/section-img.png"
							alt="services"
							height={50}
							width={50}
							className="mx-auto"
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
					{improvedServices.map((service, index) => (
						<ImprovedServices
							key={index}
							desc={service.desc}
							title={service.title}
							ico={service.ico}
							index={index}
						/>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default Improved;
