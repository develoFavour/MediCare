"use client";
import Image from "next/image";
import Slider from "./Slider";
import { motion } from "framer-motion";

const SliderHero = () => {
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
						We Maintain Cleanliness Rules Inside Our Hospital
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
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Slider />
				</motion.div>

				<div className="mt-16 text-center">
					<motion.button
						className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						View All Facilities
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 ml-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</motion.button>
				</div>
			</div>
		</section>
	);
};

export default SliderHero;
