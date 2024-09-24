import Image from "next/image";
import React from "react";
import Service from "./Service";

const Services = () => {
	const services = [
		{
			icon: "icofont-ambulance-cross",
			p: "Emergency Help Services Regardless Of The Emergency Severity",
			h3: "24/7 Ready Emergency Help Services",
		},
		{
			icon: "icofont-medical-sign-alt",
			p: "Expert Services With Access To The Best Medical Apparatus",
			h3: "Top Health Care Services With Us",
		},
		{
			icon: "icofont-stethoscope",
			p: "Affordable and Tailored Health Care Services",
			h3: "Affordable Health Care Services",
		},
	];
	return (
		<section className="section">
			<div className="container lg:pt-32">
				<div className="lg:section-title sm:p-6 flex flex-col gap-2 justify-center">
					<div className="in-head flex flex-col gap-2 lg:flex-col items-center justify-center">
						<h2 className="text-[22px] text-[#2c2d3f] font-semibold text-center">
							We Are Always Ready to Help You & Your Family
						</h2>
						<Image
							src="/section-img.png"
							alt="services"
							height={50}
							width={50}
							className="max-w-full h-auto"
						/>
					</div>
					<p className="text-center pb-8">
						We Offer amazing Health Care Services You Can Trust
					</p>
				</div>
				<div className="flex flex-col lg:flex-row justify-center gap-0 lg:gap-12">
					{services.map(({ icon, p, h3 }, index) => (
						<Service
							key={index}
							icon={icon}
							h3={h3}
							p={p}
							last={index === 2 ? "none" : ""}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Services;
