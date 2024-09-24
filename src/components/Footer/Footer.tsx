import Link from "next/link";
import React from "react";
import { FaCaretRight } from "react-icons/fa";

const Footer = () => {
	const navlinks = [
		{ link: "/", name: "Home" },
		{ link: "/about", name: "About Us" },
		{ link: "/services", name: "Services" },
		{ link: "/", name: "Our Cases" },
		{ link: "/", name: "Other Links" },
		{ link: "/", name: "Consulting" },
		{ link: "/", name: "Finance" },
		{ link: "/", name: "Testimonials" },
		{ link: "/", name: "FAQ" },
		{ link: "/contact", name: "Contact Us" },
	];
	return (
		<footer className="bg-[#1a76d1] footer text-white py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="single-footer mb-8 md:mb-0">
						<h2 className="text-xl font-semibold mb-4">About Us</h2>
						<p className="text-sm mb-4">
							With over 14 years in the health sector, We offer the best medical
							care from our team of expert healthcare professionals. Learn more
							about our services and book an appointment today.
						</p>
						<ul className="flex space-x-4">
							<li>
								<Link
									href="#"
									className="hover:text-blue-400 transition-colors"
								>
									<i className="icofont-facebook text-xl"></i>
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-red-400 transition-colors">
									<i className="icofont-google-plus text-xl"></i>
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="hover:text-blue-300 transition-colors"
								>
									<i className="icofont-twitter text-xl"></i>
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="hover:text-blue-500 transition-colors"
								>
									<i className="icofont-vimeo text-xl"></i>
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-red-500 transition-colors">
									<i className="icofont-pinterest text-xl"></i>
								</Link>
							</li>
						</ul>
					</div>
					<div className="single-footer mb-8 md:mb-0">
						<h2 className="text-xl font-semibold mb-4">Quick Links</h2>
						<ul className="footer-links grid grid-cols-1 sm:grid-cols-2 gap-2">
							{navlinks.map(({ link, name }, i) => (
								<li key={i} className="text-sm">
									<Link
										href={link}
										className="flex items-center hover:text-blue-300 transition-colors"
									>
										<FaCaretRight className="mr-2" />
										{name}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="single-footer mb-8 md:mb-0">
						<h2 className="text-xl font-semibold mb-4">Open Hours</h2>
						<p className="text-sm mb-4">
							We offer 24 hours constant service to provide you with a variety
							of professional health care services
						</p>
						<ul className="text-sm">
							<li className="mb-2">
								Monday - Friday{" "}
								<span className="float-right">8:00 - 20:00</span>
							</li>
							<li className="mb-2">
								Saturday - Sunday{" "}
								<span className="float-right">9:00 - 18:30</span>
							</li>
							<li className="mb-2">
								Monday - Thursday{" "}
								<span className="float-right">9:00 - 15:00</span>
							</li>
						</ul>
					</div>
					<div className="single-footer">
						<h2 className="text-xl font-semibold mb-4">Newsletter</h2>
						<p className="text-sm mb-4">
							Stay up to date with our info and subscribe to sign up for our
							Monthly Newsletter
						</p>
						<form className="flex">
							<input
								name="email"
								placeholder="Email Address"
								className="bg-white border-[#1a76d1] text-white px-4 py-2 w-full outline-none text-sm"
								type="email"
							/>
							<button
								className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2"
								type="submit"
							>
								<i className="icofont-paper-plane"></i>
							</button>
						</form>
					</div>
				</div>
			</div>
			<div className="mt-12 pt-8 border-t border-white text-center text-sm">
				<p>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default Footer;
