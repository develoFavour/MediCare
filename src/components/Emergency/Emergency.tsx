import React from "react";

const Emergency = () => {
	return (
		<section className="bg-image-2 overlay-bg py-8">
			<div className="container mx-auto px-4">
				<div className="content relative text-center md:text-left">
					<h2 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold text-gray-800 mb-4">
						Do you need Emergency Medical Care? Call @ 01 223 023
					</h2>
					<p className="text-gray-600 mb-6 text-center">
						Emergency Help Services Regardless Of The Emergency Severity
					</p>
					<div className="flex flex-row md:flex-row justify-center">
						<button className="btn-2">Contact Us</button>
						<button className="btn second">Learn More</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Emergency;
