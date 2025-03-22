import Image from "next/image";
import Link from "next/link";
import React from "react";
interface BlogProps {
	title: string;
	content: string;
	image: string;
	date: string;
	category: string;
	index: number;
}

const ArticleCard = ({
	title,
	content,
	image,
	date,
	category,
	index,
}: BlogProps) => {
	return (
		<div className="single-news">
			<div className="">
				<div className="news-head">
					<Image
						src={image}
						alt={title}
						width={400}
						height={300}
						className="news-head-img object-cover"
					/>
				</div>
				<div className="news-body news-content">
					<div className="date">{date}</div>
					<h2>
						<Link href="/blogs/1">{title}</Link>
					</h2>
					<p>{content}</p>
				</div>
			</div>
		</div>
	);
};

export default ArticleCard;
