import Image from "next/image";
import React from "react";
import ArticleCard from "./ArticleCard";

const RecentNews = () => {
	const newsDetails = [
		{
			title: "We have annnocuced our new product.",
			// author: "John Doe",
			date: "22 Aug, 2024",
			image: "/blog1.jpg",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
		{
			title: "Top five way for solving teeth problems.",
			// author: "John Doe",
			date: "15 Jul, 2024",
			image: "/blog2.jpg",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
		{
			title: "We provide highly business soliutions.",
			// author: "John Doe",
			date: "05 Jan, 2024",
			image: "/blog3.jpg",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		},
	];
	return (
		<div className="section">
			<div className=" container section-title flex flex-col justify-center">
				<div className="in-head flex flex-col items-center justify-center">
					<h2>Keep up with Our Most Recent Medical News.</h2>
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
			<div className="flex flex-col md:flex-row lg:flex-row gap-4 container">
				{newsDetails.map(({ title, content, image, date }, id) => (
					<ArticleCard
						key={id}
						title={title}
						content={content}
						image={image}
						date={date}
					/>
				))}
			</div>
		</div>
	);
};

export default RecentNews;
