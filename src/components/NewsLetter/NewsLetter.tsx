import React from "react";

const NewsLetter = () => {
	return (
		<div className="section bg-[#edf2ff] py-8 px-4">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
				<div className="text-center md:text-left mb-4 md:mb-0">
					<h3 className="newsletter-head text-xl md:text-2xl font-semibold mb-2">
						Sign up for newsletter
					</h3>
					<p className="para text-sm md:text-base">
						Subscribe to sign up for our Monthly Newsletter
					</p>
				</div>
				<div className="newsletter-mail w-full md:w-auto">
					<form className="flex md:flex-row items-center">
						<input
							type="email"
							placeholder="Enter your email address"
							className="newsletter-input w-full md:w-64 px-4 py-2 mb-2 md:mb-0 md:mr-2 rounded-md"
						/>
						<button className="btn w-full md:w-auto px-6 py-2  text-white rounded-md hover:bg-blue-700 transition-colors">
							Subscribe
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default NewsLetter;
