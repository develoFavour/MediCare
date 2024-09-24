import Image from "next/image";
import React from "react";
import ImprovedServices from "./ImprovedServices";
import { title } from "process";

const Improved = () => {
	const improvedServices = [
		{
			title: "General Treatment",
			ico: "icofont-prescription",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Teeth Whitening",
			ico: "icofont-tooth",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Heart Surgery",
			ico: "icofont-heart-alt",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Ear Treatment",
			ico: " icofont-listening",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Vision Problems",
			ico: "icofont-eye-alt",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
		{
			title: "Blood Transfusion",
			ico: "icofont-blood",
			desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus dictum eros ut imperdiet.",
		},
	];
	return (
		<div className="section container">
			<div className="section-title flex flex-col justify-center">
				<div className="in-head flex flex-col items-center justify-center">
					<h2>We Offer Different Services To Improve Your Health</h2>
					<Image
						src="/section-img.png"
						alt="services"
						height={50}
						width={50}
						className="max-w-full h-auto"
					/>
				</div>
				<p>We Offer amazing Health Care Services You Can Trust</p>
			</div>
			<div className="grid lg:grid-cols-3 md:grid-cols-2 px-4 justify-center items-center lg:pl-16">
				{improvedServices.map(({ desc, title, ico }, i) => (
					<ImprovedServices key={i} desc={desc} title={title} ico={ico} />
				))}
			</div>
		</div>
	);
};

export default Improved;
