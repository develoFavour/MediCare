"use client";

import Link from "next/link";

import Image from "next/image";
import {
	RiArrowDropDownLine,
	RiArrowUpSLine,
	RiMenu3Line,
} from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TopNav from "./Top-Nav/TopNav";

export default function Navigation() {
	const path = usePathname();
	const [isSticky, setIsSticky] = useState(false);
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setIsSticky(true);
				setShowScrollTop(true);
			} else {
				setIsSticky(false);
				setShowScrollTop(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<>
			<header>
				<TopNav />
				<div className={`header ${isSticky ? "sticky" : ""}`}>
					<nav
						className={`container container-nav header-inner flex justify-between items-center ${
							isSticky ? "animate-slideDown" : ""
						}`}
					>
						<div className="mt-[18px]">
							<Link href="/">
								<Image
									src="/medicare-logo.png"
									alt="logo"
									height={50}
									width={150}
									className="w-full"
								/>
							</Link>
						</div>
						<div className="hidden md:block mt-[18px]">
							<ul className="flex gap-3">
								<li
									className={`${
										path === "/" ? "active" : ""
									} relative mr-[15px]`}
								>
									<Link href="/">Home</Link>
								</li>
								<li
									className={`${
										path === "/doctors" ? "active" : ""
									} relative mr-[15px]`}
								>
									<Link href="/doctors">Doctors</Link>
								</li>
								<li
									className={`${
										path === "/services" ? "active" : ""
									} relative mr-[15px]`}
								>
									<Link href="/services">Services</Link>
								</li>
								<li
									className={`${
										path === "/pages" ? "active" : ""
									} relative dropdown-container mr-[15px]`}
								>
									<Link href="/pages" className="flex items-center">
										Pages{" "}
										<span>
											<RiArrowDropDownLine />
										</span>
									</Link>
									<ul className="dropdown">
										<li>
											<Link href="/not-found">About Us</Link>
										</li>
										<li>
											<Link href="/not-found">Login/Sign-Up</Link>
										</li>
									</ul>
								</li>
								<li
									className={`${
										path === "/pages" ? "active" : ""
									} relative dropdown-container mr-[15px]`}
								>
									<Link href="/blogs" className="flex items-center">
										Blogs{" "}
										<span>
											<RiArrowDropDownLine />
										</span>
									</Link>
									<ul className="dropdown">
										<li>
											<Link href="/blog/blog-post-1">Blog Post 1</Link>
										</li>
									</ul>
								</li>
								<li
									className={`${
										path === "/contact" ? "active" : ""
									} relative mr-[15px]`}
								>
									<Link href="/contact">Contact Us</Link>
								</li>
							</ul>
						</div>
						<div className="hidden md:block mt-[18px]">
							<button className="btn">Schedule Appointments</button>
						</div>
						<div className="md:hidden">
							<button onClick={toggleMobileMenu} className="p-2">
								<RiMenu3Line size={24} />
							</button>
						</div>
					</nav>
				</div>
			</header>
			{isMobileMenuOpen && (
				<div className="md:hidden bg-white shadow-md">
					<ul className="py-2">
						<li className="px-4 py-2">
							<Link href="/">Home</Link>
						</li>
						<li className="px-4 py-2">
							<Link href="/doctors">Doctors</Link>
						</li>
						<li className="px-4 py-2">
							<Link href="/services">Services</Link>
						</li>
						<li className="px-4 py-2">
							<Link href="/pages">Pages</Link>
						</li>
						<li className="px-4 py-2">
							<Link href="/blogs">Blogs</Link>
						</li>
						<li className="px-4 py-2">
							<Link href="/contact">Contact Us</Link>
						</li>
						<li className="px-4 py-2">
							<button className="btn w-full">Schedule Appointments</button>
						</li>
					</ul>
				</div>
			)}
			{showScrollTop && (
				<button
					className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 z-10"
					onClick={scrollToTop}
					aria-label="Scroll to top"
				>
					<RiArrowUpSLine size={24} />
				</button>
			)}
		</>
	);
}
