import Image from "next/image";
import React from "react";

import Slider from "./Slider";

const SliderHero = () => {
	return (
		<section className="section">
			<div className="section-title flex flex-col justify-center">
				<div className="in-head flex flex-col items-center justify-center">
					<h2 className="">
						We Maintain Cleanliness Rules Inside Our Hospital
					</h2>
					<Image
						src="/section-img.png"
						alt="services"
						height={50}
						width={50}
						className="max-w-full h-auto w-auto"
					/>
				</div>
				<p>We Offer amazing Health Care Services You Can Trust</p>
			</div>
			<Slider />
		</section>
	);
};

export default SliderHero;
