import React from "react";
import Slider from "./Slider/Slider";
import Cards from "./Card/Card";

const Banner = () => {
	const cardDetails = [
		{
			title: "Emergency Cases",
			description:
				"We provide immediate medical attention and treatment for life-threatening conditions.",
			contentTitle: "Our emergency services include:",
			contentList1: "Trauma care",
			contentList2: "Cardiac emergencies and Accident",
			contentList3: "Advanced medical care.",
		},
		{
			title: "Specialized Care Centers",
			description:
				"Experience world-class treatment at our state-of-the-art specialized care centers.",
			contentTitle: "Our centers of excellence feature:",
			contentList1: "Advanced Cancer Treatment Center",
			contentList2: "Comprehensive Cardiovascular Institute",
			contentList3: "Neuroscience and Spine Center",
		},
		{
			title: "Opening Hours",
			description:
				"Take control of your health with our tailored preventive care packages.",
			contentTitle: "Our preventive health services offer:",
			contentList1: "Comprehensive health screenings",
			contentList2: "Personalized wellness plans",
			contentList3: "Lifestyle and nutrition counseling",
		},
	];
	return (
		<div>
			<Slider />
			<div className="flex flex-col lg:flex-row gap-4 px-4 justify-center lg:absolute left-0 right-0 top-[32rem] ">
				{/* md:flex-row p-4 md:p-8 gap-4 justify-center absolute  md:top-[31rem] sm:top-[34rem] left-0 right-0 */}
				{cardDetails.map(
					(
						{ title, contentTitle, contentList1, contentList2, contentList3 },
						index
					) => {
						return (
							<div key={index}>
								<Cards
									title={title}
									contentTitle={contentTitle}
									contentList1={contentList1}
									contentList2={contentList2}
									contentList3={contentList3}
								/>
							</div>
						);
					}
				)}
			</div>
		</div>
	);
};

export default Banner;
