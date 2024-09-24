"use client";
import React from "react";
import Image from "next/image";
import Slider from "react-slick";

// You'll need to install these packages:
// npm install react-slick slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Sponsors: React.FC = () => {
	const sponsors = [
		{ url: "/client1.png" },
		{ url: "/client2.png" },
		{ url: "/client3.png" },
		{ url: "/client4.png" },
		{ url: "/client5.png" },
		{ url: "/client2.png" },
		{ url: "/client3.png" },
		{ url: "/client2.png" },
	];

	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		arrows: false,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<div className="clients overlay-bg">
			<div className="container px-4">
				<Slider {...settings}>
					{sponsors.map((sponsor, id) => (
						<div key={id} className="px-2">
							<div className="flex items-center justify-center h-12">
								<Image
									src={sponsor.url}
									alt={`Sponsor ${id + 1}`}
									width={140}
									height={40}
									objectFit="contain"
									className=""
								/>
							</div>
						</div>
					))}
				</Slider>
			</div>
		</div>
	);
};

export default Sponsors;
