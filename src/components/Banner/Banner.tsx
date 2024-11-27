"use client";
import React from "react";
import Slider from "./Slider/Slider";
import Cards from "./Card/Card";
import { motion } from "framer-motion";

interface CardDetail {
	title: string;
	contentTitle: string;
	contentList1: string;
	contentList2: string;
	contentList3: string;
}

const Banner: React.FC = () => {
	const cardDetails: CardDetail[] = [
		{
			title: "Emergency Cases",
			contentTitle: "Our emergency services include:",
			contentList1: "Trauma care",
			contentList2: "Cardiac emergencies and Accident",
			contentList3: "Advanced medical care.",
		},
		{
			title: "Specialized Care Centers",
			contentTitle: "Our centers of excellence feature:",
			contentList1: "Advanced Cancer Treatment Center",
			contentList2: "Comprehensive Cardiovascular Institute",
			contentList3: "Neuroscience and Spine Center",
		},
		{
			title: "Opening Hours",
			contentTitle: "Our preventive health services offer:",
			contentList1: "Comprehensive health screenings",
			contentList2: "Personalized wellness plans",
			contentList3: "Lifestyle and nutrition counseling",
		},
	];

	return (
		<div className="relative">
			<Slider />

			<motion.div
				className="container mx-auto px-4 py-8 lg:absolute lg:top-[35rem] lg:left-0 lg:right-0 lg:bottom-0 lg:transform lg:translate-y-1/2"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{cardDetails.map((card, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
						>
							<Cards
								title={card.title}
								contentTitle={card.contentTitle}
								contentList1={card.contentList1}
								contentList2={card.contentList2}
								contentList3={card.contentList3}
							/>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
};

export default Banner;
