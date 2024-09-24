import React from "react";
import Counter from "./Counter";

const Details = () => {
	const counter = [
		{ label: "Hotel Rooms", end: 3469, icon: "icofont-home" },
		{ label: "Specialist Doctors", end: 557, icon: "icofont-user-alt-3" },
		{ label: "Happy Patient", end: 4379, icon: "icofont-simple-smile" },
		// { label: "Friendly Staff", end: 1238, icon: "icofont-doctor-alt" },
		{ label: "High-Quality Staff", end: 8912, icon: "icofont-tick-boxed" },
	];
	return (
		<section className="section bg-image overlay-bg">
			<div className="lg:container md:container flex md:justify-center pl-6">
				<div className="lg:flex grid md:grid-cols-2 md:justify-center justify-start lg:justify-center gap-8">
					{counter.map(({ label, end, icon }, index) => (
						<div key={index} className="details_icon flex items-center">
							<i className={icon}></i>

							<Counter label={label} end={end} duration={2000} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Details;
