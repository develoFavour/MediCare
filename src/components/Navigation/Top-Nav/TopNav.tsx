import Link from "next/link";
import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const TopNav = () => {
	return (
		<>
			<div className="container padding-top-nav flex flex-col md:flex-row justify-between items-center">
				<div className="mb-2 md:mb-0">
					<ul className="flex flex-wrap justify-center md:justify-start gap-4">
						<li className="top-nav-color mr-[15px]">
							<Link
								href="/about"
								className="hover:text-[#1a76d1] transition-all duration-300"
							>
								About
							</Link>
						</li>
						<li className="top-nav-color mr-[15px]">
							<Link
								href="/doctors"
								className="hover:text-[#1a76d1] transition-all duration-300"
							>
								Doctors
							</Link>
						</li>
						<li className="top-nav-color mr-[15px]">
							<Link
								href="/contact"
								className="hover:text-[#1a76d1] transition-all duration-300"
							>
								Contact
							</Link>
						</li>
						<li className="top-nav-color mr-[15px]">
							<Link
								href="/faq"
								className="hover:text-[#1a76d1] transition-all duration-300"
							>
								FAQ
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<ul className="flex flex-row  items-center gap-4">
						<li className="flex items-center gap-2">
							<span>
								<FaPhoneAlt className="top-nav-icon" fontSize={10} />
							</span>
							<span className="top-nav-color cursor-pointer hover:text-[#1a76d1] transition-all duration-300">
								+234 7025 130492
							</span>
						</li>
						<li className="flex items-center gap-2">
							<span>
								<MdEmail className="top-nav-icon" />
							</span>
							<p className="top-nav-color cursor-pointer hover:text-[#1a76d1] transition-all duration-300">
								medicare@gmail.com
							</p>
						</li>
					</ul>
				</div>
			</div>
			<hr className="text-[#80808040]" />
		</>
	);
};

export default TopNav;
