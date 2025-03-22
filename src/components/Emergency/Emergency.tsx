"use client";
import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Emergency = () => {
	return (
		<section className="relative py-20 overflow-hidden">
			{/* Background with overlay */}
			<div className="absolute inset-0 bg-[#032b53] z-0">
				<div className="absolute inset-0 bg-gradient-to-r from-[#032b53]/90 to-[#116aef]/80"></div>

				{/* Abstract shapes */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-[#5d9eff]/10 rounded-full -mr-32 -mt-32"></div>
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5d9eff]/10 rounded-full -ml-32 -mb-32"></div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<motion.div
					className="max-w-3xl mx-auto text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
						Do you need Emergency Medical Care?
					</h2>

					<div className="flex items-center justify-center mb-8">
						<div className="bg-white/20 rounded-full p-4 mr-4">
							<Phone className="h-8 w-8 text-white" />
						</div>
						<span className="text-2xl md:text-3xl font-bold text-white">
							01 223 023
						</span>
					</div>

					<p className="text-white/80 text-lg mb-10">
						Our emergency team is available 24/7 to provide immediate care when
						you need it most.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<motion.button
							className="bg-white text-[#116aef] hover:bg-blue-50 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Contact Us
							<Phone className="ml-2 h-4 w-4" />
						</motion.button>

						<motion.button
							className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center justify-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Learn More
							<ArrowRight className="ml-2 h-4 w-4" />
						</motion.button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Emergency;
