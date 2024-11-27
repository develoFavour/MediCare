import Image from "next/image";
import React from "react";
import Form from "./Form";

const AppointmentContainer = () => {
	return (
		<div className="container section">
			<div className="section-title flex flex-col justify-center">
				<div className="in-head flex flex-col items-center justify-center">
					<h2>We Are Always Ready to Help You. Book An Appointment</h2>
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
			<Form />
		</div>
	);
};

export default AppointmentContainer;
