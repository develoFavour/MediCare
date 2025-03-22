"use client";
import Image from "next/image";
import Form from "./Form";
import { motion } from "framer-motion";

const AppointmentContainer = () => {
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
						We Are Always Ready to Help You. Book An Appointment
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
					className="max-w-4xl mx-auto"
				>
					<Form />
				</motion.div>
			</div>
		</section>
	);
};

export default AppointmentContainer;
