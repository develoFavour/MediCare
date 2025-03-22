import Image from "next/image";
import React from "react";
interface Props {
	ico: string;
	title: string;
	desc: string;
	index: number;
}

const ImprovedServices = ({ ico, title, desc, index }: Props) => {
	return (
		<div className="flex improved single-service">
			<div>
				<i className={ico}></i>
			</div>
			<div className="details">
				<h4 className="uppercase">{title}</h4>
				<p className="lg:max-w-64">{desc}</p>
			</div>
		</div>
	);
};

export default ImprovedServices;
