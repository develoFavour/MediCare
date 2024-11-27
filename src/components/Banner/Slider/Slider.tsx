"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	motion,
	AnimatePresence,
	useAnimation,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Slide {
	title: string;
	description: string;
	image: string;
	icon: string;
}

const slides: Slide[] = [
	{
		title: "Medical Services That You Can Trust!",
		description:
			"At MediCare, we are committed to providing trusted medical services that transform lives.",
		image: "/slider.jpg",
		icon: "🏥",
	},
	{
		title: "Expert Medical Care With Us",
		description:
			"Get the best medical care from our team of expert healthcare professionals. Learn more about our services and book an appointment today.",
		image: "/slider2.jpg",
		icon: "👨‍⚕️",
	},
	{
		title: "Treatment with Care.",
		description:
			"Our team of expert healthcare professionals is dedicated to providing trusted medical services with compassion and care.",
		image: "/slider3.jpg",
		icon: "❤️",
	},
];

interface SlideProps {
	slide: Slide;
	isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ slide, isActive }) => {
	const controls = useAnimation();
	const [ref, inView] = useInView({
		threshold: 0.5,
		triggerOnce: true,
	});

	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [-100, 100], [5, -5]);
	const rotateY = useTransform(x, [-100, 100], [-5, 5]);

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		x.set((event.clientX - centerX) / 10);
		y.set((event.clientY - centerY) / 10);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<motion.div
			ref={ref}
			className="w-full h-full flex-shrink-0 relative overflow-hidden"
			initial="hidden"
			animate={controls}
			variants={{
				visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
				hidden: { opacity: 0, scale: 0.8 },
			}}
			style={{
				perspective: 1000,
			}}
		>
			<motion.div
				className="w-full h-full relative"
				style={{
					rotateX: rotateX,
					rotateY: rotateY,
				}}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url(${slide.image})`,
						filter: "brightness(0.7)",
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-transparent" />
				<div className="relative h-full flex flex-col justify-center px-8 md:px-16 text-white z-10">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-6xl mb-4"
					>
						{slide.icon}
					</motion.div>
					<motion.h2
						className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						{slide.title.split(" ").map((word, i) => (
							<span
								key={i}
								className={i === 1 || i === 7 ? "text-blue-300" : ""}
							>
								{word}{" "}
							</span>
						))}
					</motion.h2>
					<motion.p
						className="text-lg md:text-xl max-w-2xl mb-8"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
					>
						{slide.description}
					</motion.p>
					<motion.div
						className="flex gap-4"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.8 }}
					>
						<Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
							Book Appointment
						</Button>
						<Button
							variant="outline"
							className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-500"
						>
							Learn More
						</Button>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default function EnhancedMedicalSlider() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
				6000
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
		<div
			className="relative w-full h-screen overflow-hidden bg-[#2c2d3f]"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<AnimatePresence initial={false} mode="wait">
				<motion.div
					key={currentSlide}
					className="absolute inset-0"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Slide slide={slides[currentSlide]} isActive={true} />
				</motion.div>
			</AnimatePresence>

			<Button
				variant="ghost"
				size="icon"
				className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-blue-500/50 rounded-full hover:bg-blue-600/50 transition-all duration-300"
				onClick={() =>
					goToSlide((currentSlide - 1 + slides.length) % slides.length)
				}
			>
				<ChevronLeft className="h-8 w-8" />
				<span className="sr-only">Previous slide</span>
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-blue-500/50 rounded-full hover:bg-blue-600/50 transition-all duration-300"
				onClick={() => goToSlide((currentSlide + 1) % slides.length)}
			>
				<ChevronRight className="h-8 w-8" />
				<span className="sr-only">Next slide</span>
			</Button>

			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
				{slides.map((_, index) => (
					<button
						key={index}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentSlide ? "bg-white scale-125" : "bg-white/50"
						}`}
						onClick={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
