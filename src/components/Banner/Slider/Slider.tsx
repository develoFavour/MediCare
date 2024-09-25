"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Cards from "../Card/Card";

const slides = [
	{
		title: "Medical Services That You Can Trust!",
		description:
			"At MediCare, we are committed to providing trusted medical services that transform lives.",
		image: "/slider.jpg",
	},
	{
		title: "Expert Medical Care With Us",
		description:
			"Get the best medical care from our team of expert healthcare professionals. Learn more about our services and book an appointment today.",
		image: "/slider2.jpg",
	},
	{
		title: "Treatment with Care.",
		description:
			"Our team of expert healthcare professionals is dedicated to providing trusted medical services with compassion and care.",
		image: "/slider3.jpg",
	},
];

export default function MedicalSlider() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [isPaused, setIsPaused] = useState(false);

	const resetTimeout = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	useEffect(() => {
		resetTimeout();
		if (!isPaused) {
			timeoutRef.current = setTimeout(
				() => setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length),
				4000
			);
		}
		return () => {
			resetTimeout();
		};
	}, [currentSlide, isPaused]);

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
	};

	return (
		<>
			<div
				className="relative w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div
					className="flex transition-transform duration-1000 ease-in-out h-full"
					style={{ transform: `translateX(-${currentSlide * 100}%)` }}
				>
					{slides.map((slide, index) => (
						<div
							key={index}
							className="w-full h-full flex-shrink-0 relative"
							style={{
								backgroundImage: `url(${slide.image})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						>
							<div className="absolute inset-0 bg-opacity-50" />
							<AnimatePresence initial={false} mode="wait">
								<motion.div
									key={currentSlide}
									className="absolute inset-0"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<div
										className="w-full h-full relative"
										style={{
											backgroundImage: `url(${slides[currentSlide].image})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									>
										<div className="absolute inset-0 bg-opacity-50" />
										<div className="relative top-1/4 left-8 xs:left-6 sm:left-8 md:left-12 inset-0 flex flex-col justify-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 text-[#2c2d3f]">
											<motion.h2
												className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold mb-1 xs:mb-2 sm:mb-3 md:mb-4 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl"
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.2 }}
											>
												{slides[currentSlide].title
													.split(" ")
													.map((word, i) => (
														<span
															key={i}
															className={
																i === 1 || i === 7 ? "text-blue-500" : ""
															}
														>
															{word}{" "}
														</span>
													))}
											</motion.h2>
											<motion.p
												className="text-xs xs:text-sm md:text-base max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mb-2 xs:mb-3 sm:mb-4 md:mb-6 lg:mb-8"
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.4 }}
											>
												{slides[currentSlide].description}
											</motion.p>
											<motion.div
												className="flex flex-row pt-4 xs:flex-row gap-2 xs:gap-3 sm:gap-4"
												initial={{ opacity: 0, y: -50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5, delay: 0.6 }}
											>
												<Button
													size="sm"
													className="btn slider-btn text-xs xs:text-sm sm:text-base"
												>
													Book Appointment
												</Button>
												<Button
													size="sm"
													className="slider-btn2 btn text-xs xs:text-sm sm:text-base"
												>
													Learn More
												</Button>
											</motion.div>
										</div>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>
					))}
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="absolute left-1 xs:left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-white bg-[#1a76d1] rounded-full hover:bg-[#2c2d3f] hover:text-white duration-500"
					onClick={() =>
						goToSlide((currentSlide - 1 + slides.length) % slides.length)
					}
				>
					<ChevronLeft className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
					<span className="sr-only">Previous slide</span>
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-1 xs:right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-white bg-[#1a76d1] rounded-full hover:bg-[#2c2d3f] hover:text-white duration-500"
					onClick={() => goToSlide((currentSlide + 1) % slides.length)}
				>
					<ChevronRight className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
					<span className="sr-only">Next slide</span>
				</Button>
				<div className="absolute bottom-1 xs:bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 xs:gap-1.5 sm:gap-2">
					{slides.map((_, index) => (
						<button
							key={index}
							className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full ${
								index === currentSlide ? "bg-white" : "bg-white/50"
							}`}
							onClick={() => goToSlide(index)}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</>
	);
}
