import React from "react";
type Props = {
	icon: string;
	h3: string;
	p: string;
	last: string;
};

const Service = ({ icon, h3, p, last }: Props) => {
	return (
		<div className={`services w-full flex justify-center lg:w-[22rem] ${last}`}>
			<div className="icon">
				<i className={icon}></i>

				<div className="relative">
					<h3>{h3}</h3>
					<p className="mt-5">{p}</p>
				</div>
			</div>
		</div>
	);
};

export default Service;
