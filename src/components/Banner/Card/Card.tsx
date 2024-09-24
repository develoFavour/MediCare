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
		<div className="flex flex-col justify-center rounded-[1rem] bg-[#1a76d1] text-white ">
			<Card className="pt-8 pr-8 pl-8 rounded-[1rem]">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="pb-2">{contentTitle}</p>
					<ul className="list-disc">
						<li>{contentList1}</li>
						<li> {contentList2} </li>
						<li>{contentList3}</li>
					</ul>
				</CardContent>
				<CardFooter>
					<p className="flex items-center gap-2">
						Learn More{" "}
						<span>
							<FaArrowRightLong />
						</span>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Cards;
