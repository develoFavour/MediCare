import React from "react";
import Slider from "./Slider/Slider";
import Cards from "./Card/Card";

const Banner = () => {
	const cardDetails = [
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
			<div className="container mx-auto px-4 py-8 lg:absolute lg:left-0 lg:right-0 lg:top-[32rem]">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{cardDetails.map(
						(
							{ title, contentTitle, contentList1, contentList2, contentList3 },
							index
						) => (
							<Cards
								key={index}
								title={title}
								contentTitle={contentTitle}
								contentList1={contentList1}
								contentList2={contentList2}
								contentList3={contentList3}
							/>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default Banner;
