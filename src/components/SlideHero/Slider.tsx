"use client";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

const Slider = () => {
	const images = [
		{ url: "/pf1.jpg" },
		{ url: "/pf2.jpg" },
		{ url: "/pf3.jpg" },
		{ url: "/pf4.jpg" },
		{ url: "/pf1.jpg" },
		{ url: "/pf2.jpg" },
		{ url: "/pf3.jpg" },
		{ url: "/pf4.jpg" },
	];
	return (
		<div className="container">
			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				plugins={[
					Autoplay({
						delay: 3000,
					}),
				]}
				className="w-full mx-auto"
			>
				<CarouselContent>
					{images.map(({ url }, index) => (
						<CarouselItem
							key={index}
							className="basis-1/2 md:basis-1/3 lg:basis-1/4"
						>
							<Card className="border-none shadow-none">
								<CardContent className="p-0">
									<div className="relative overflow-hidden group">
										<Image
											src={url}
											alt={"slider-img"}
											width={400}
											height={300}
											className="w-[337px] h-64 object-cover"
										/>
										<div className="absolute inset-0 bg-[#1a76d171] bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									</div>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default Slider;
