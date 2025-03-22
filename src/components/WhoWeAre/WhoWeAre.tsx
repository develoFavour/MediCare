"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { X, Play, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
	"24/7 Customer Support",
	"Patient-Centric Care",
	"Efficient Care Delivery",
	"Personalized Care Plans",
	"High-Quality Medical Services",
	"Patient Satisfaction Guarantee",
];

const WhoWeAre = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handlePlayClick = useCallback(() => {
		setShowModal(true);
		setIsPlaying(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setShowModal(false);
		setIsPlaying(false);
		if (videoRef.current) {
			videoRef.current.pause();
		}
	}, []);

	const handleVideoClick = useCallback(() => {
		if (videoRef.current) {
			if (videoRef.current.paused) {
				videoRef.current.play();
				setIsPlaying(true);
			} else {
				videoRef.current.pause();
				setIsPlaying(false);
			}
		}
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleCloseModal();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleCloseModal]);

	return (
		<section className="py-20 px-4 bg-white">
			<div className="container mx-auto max-w-7xl">
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
						Our Services are Highly Aimed at Providing Different Health Care
						Services To Provide Our Client With The Best Health Care Services.
					</p>
				</motion.div>

				<div className="flex flex-col md:flex-row gap-12 items-center">
					<motion.div
						className="md:w-1/2"
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h3 className="text-2xl font-bold text-[#032b53] mb-6">
							Who We Are
						</h3>
						<p className="text-gray-600 mb-8 leading-relaxed">
							We envision a world where healthcare is accessible, efficient, and
							patient-centered. By leveraging cutting-edge technology, we aim to
							bridge the gap between patients and providers, ensuring that
							quality care is just a click away.
						</p>
						<h3 className="text-2xl font-bold text-[#032b53] mb-6">
							Our Features
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{features.map((feature, index) => (
								<motion.div
									key={index}
									className="flex items-center"
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.3, delay: index * 0.1 }}
								>
									<CheckCircle className="h-5 w-5 text-[#116aef] mr-3 flex-shrink-0" />
									<span className="text-gray-700">{feature}</span>
								</motion.div>
							))}
						</div>
					</motion.div>

					<motion.div
						className="md:w-1/2"
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className="relative rounded-xl overflow-hidden shadow-xl">
							<div
								className="relative pt-[56.25%] cursor-pointer group"
								onClick={handlePlayClick}
							>
								<Image
									src="/video-bg.jpg"
									alt="Video Cover"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
									layout="fill"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#032b53]/60 to-transparent"></div>

								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative">
										{/* Animated waves */}
										<div className="absolute -inset-4 flex items-center justify-center">
											<div className="absolute w-16 h-16 rounded-full border-2 border-white opacity-70 animate-ping"></div>
											<div className="absolute w-20 h-20 rounded-full border-2 border-white opacity-50 animate-pulse"></div>
											<div className="absolute w-24 h-24 rounded-full border-2 border-white opacity-30"></div>
										</div>

										{/* Play button */}
										<div className="relative z-10 w-16 h-16 bg-[#116aef] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
											<Play className="h-6 w-6 text-white ml-1" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{showModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
						<div className="relative w-full max-w-4xl">
							<button
								onClick={handleCloseModal}
								className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 rounded-full bg-[#116aef]/20 hover:bg-[#116aef]/40 transition-colors"
							>
								<X size={24} />
							</button>
							<div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-2xl">
								<div
									className="absolute inset-0 flex items-center justify-center cursor-pointer"
									onClick={handleVideoClick}
								>
									<video
										ref={videoRef}
										className="w-full h-full"
										src="/Medi-Care.mp4"
										autoPlay
										controls={isPlaying}
									></video>
									{!isPlaying && (
										<div className="absolute inset-0 flex items-center justify-center">
											<Image
												src="/video-bg.jpg"
												alt="Video Cover"
												layout="fill"
												objectFit="contain"
											/>
											<div className="absolute inset-0 bg-black bg-opacity-40"></div>
											<div className="relative z-10">
												<div className="w-16 h-16 bg-[#116aef] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
													<Play className="h-6 w-6 text-white ml-1" />
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default WhoWeAre;
