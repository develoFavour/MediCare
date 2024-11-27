import Image from "next/image";
import React from "react";
import Offer from "./Offer";

const Offers = () => {
	return (
		<div className="bg-[#f9f9f9]">
			<div className="section container ">
				<div className="section-title flex flex-col justify-center">
					<div className="in-head flex flex-col items-center justify-center">
						<h2>We Provide You The Best Treatment In Resonable Price</h2>
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
				<Offer />
			</div>
		</div>
	);
};

export default Offers;
