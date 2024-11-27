import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FaArrowRightLong } from "react-icons/fa6";
import Link from "next/link";

type Props = {
	title: string;

	contentTitle: string;
	contentList1: string;
	contentList2: string;
	contentList3: string;
};
const Cards = ({
	title,

	contentTitle,
	contentList1,
	contentList2,
	contentList3,
}: Props) => {
	return (
		<div className="card">
			<div className="inner">
				<div className="icon">
					<i className="fa-ambulance"></i>
				</div>
				<div className="single-content">
					<span>{title}</span>
					<h4>{contentTitle}</h4>
					<p>{contentList1}</p>
					<p>{contentList2}</p>
					<p>{contentList3}</p>
					<Link href="#">
						<p className="flex items-center gap-1">
							<span>LEARN MORE</span>{" "}
							<span className="pb-[2px]">
								<FaArrowRightLong />
							</span>
						</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Cards;
