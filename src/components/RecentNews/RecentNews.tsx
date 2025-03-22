"use client";
import Image from "next/image";
import ArticleCard from "./ArticleCard";
import { motion } from "framer-motion";

const RecentNews = () => {
	const newsDetails = [
		{
			title: "We have announced our new product",
			date: "22 Aug, 2024",
			image: "/blog1.jpg",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			category: "Products",
		},
		{
			title: "Top five ways for solving teeth problems",
			date: "15 Jul, 2024",
			image: "/blog2.jpg",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			category: "Dental Care",
		},
		{
			title: "We provide highly business solutions",
			date: "05 Jan, 2024",
			image: "/blog3.jpg",
			content:
				"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			category: "Business",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<section className="py-20 bg-gradient-to-b from-blue-50 to-white">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-4">
						Keep up with Our Most Recent Medical News
					</h2>
					<div className="flex justify-center mb-4">
						<Image
							src="/section-img.png"
							alt="services"
							height={50}
							width={50}
							className="mx-auto"
						/>
					</div>
					<p className="text-gray-600 max-w-2xl mx-auto">
						We Offer amazing Health Care Services You Can Trust
					</p>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{newsDetails.map((article, index) => (
						<ArticleCard
							key={index}
							title={article.title}
							content={article.content}
							image={article.image}
							date={article.date}
							category={article.category}
							index={index}
						/>
					))}
				</motion.div>

				<div className="text-center mt-12">
					<motion.button
						className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						View All Articles
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 ml-2"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</motion.button>
				</div>
			</div>
		</section>
	);
};

export default RecentNews;
