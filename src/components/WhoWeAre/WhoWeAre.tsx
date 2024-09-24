"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const WhoWeAre = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const handlePlayClick = () => {
		setShowModal(true);
		setIsPlaying(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setIsPlaying(false);
		if (videoRef.current) {
			videoRef.current.pause();
		}
	};

	const handleVideoClick = () => {
		if (videoRef.current) {
			if (videoRef.current.paused) {
				videoRef.current.play();
				setIsPlaying(true);
			} else {
				videoRef.current.pause();
				setIsPlaying(false);
			}
		}
	};

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
	}, []);

	return (
		<section className="section container py-16 px-4 max-w-7xl mx-auto">
			<div className="text-center mb-12">
				<h2 className="text-2xl lg:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
					We Offer Different Services To Improve Your Health
				</h2>
				<Image
					src="/section-img.png"
					alt="services"
					height={50}
					width={50}
					className="mx-auto mb-4"
				/>
				<p className="text-gray-600 max-w-2xl mx-auto px-1">
					Our Services are Highly Aimed at Providing Different Health Care
					Services To Provide Our Client With The Best Health Care Services.
				</p>
			</div>
			<div className="flex flex-col md:flex-row gap-8">
				<div className="md:w-1/2 px-4">
					<h3 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h3>
					<p className="text-gray-600 mb-6 ">
						We envision a world where healthcare is accessible, efficient, and
						patient-centered. By leveraging cutting-edge technology, we aim to
						bridge the gap between patients and providers, ensuring that quality
						care is just a click away.
					</p>
					<h3 className="text-2xl font-bold text-gray-800 mb-4">
						Our Features
					</h3>
					<ul className="grid grid-cols-2 gap-2">
						{[
							"24/7 Customer Support",
							"Patient-Centric Care",
							"Efficient Care Delivery",
							"Personalized Care Plans",
							"High-Quality Medical Services",
							"Patient Satisfaction Guarantee",
						].map((feature, index) => (
							<li key={index} className="flex items-center text-gray-600">
								<div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
								{feature}
							</li>
						))}
					</ul>
				</div>
				<div className="md:w-1/2 px-4">
					<div className="relative pt-[56.25%] rounded-lg overflow-hidden">
						<div
							className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer video-image"
							onClick={handlePlayClick}
						>
							<Image
								src="/video-bg.jpg"
								alt="Video Cover"
								layout="fill"
								objectFit="cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-40"></div>
							<div className="relative z-10">
								<div className="promo-video">
									<div className="waves-block">
										<div className="waves wave-1"></div>
										<div className="waves wave-2"></div>
										<div className="waves wave-3"></div>
									</div>
								</div>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-[#1a76d1] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
									<i className="icofont-ui-play text-white text-2xl"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
					<div className="relative w-full max-w-4xl">
						<button
							onClick={handleCloseModal}
							className="absolute -top-10 right-0 text-white hover:text-gray-300"
						>
							<X size={24} />
						</button>
						<div className="relative pt-[56.25%]">
							<div
								className="absolute inset-0 flex items-center justify-center cursor-pointer"
								onClick={handleVideoClick}
							>
								<video
									ref={videoRef}
									className="w-full h-full"
									src="/Medi-Care.mp4"
									autoPlay
								></video>
								{!isPlaying && (
									<div className="absolute inset-0 flex items-center justify-center">
										<Image
											src="/video-bg.jpg"
											alt="Video Cover"
											layout="fill"
											objectFit="cover"
										/>
										<div className="absolute inset-0 bg-black bg-opacity-40"></div>
										<div className="relative z-10">
											<div className="w-[70px] h-[70px] bg-[#1a76d1] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
												<i className="icofont-ui-play text-white text-2xl"></i>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default WhoWeAre;
