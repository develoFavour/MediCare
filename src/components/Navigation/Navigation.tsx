"use client";

import Link from "next/link";
import Image from "next/image";
import {
	RiArrowDropDownLine,
	RiArrowUpSLine,
	RiMenu3Line,
	RiCloseLine,
} from "react-icons/ri";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TopNav from "./Top-Nav/TopNav";
import { motion, AnimatePresence } from "framer-motion";

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

	const menuVariants = {
		closed: {
			opacity: 0,
			x: "-100%",
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
				staggerDirection: -1,
			},
		},
		open: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
				staggerDirection: 1,
			},
		},
	};

	const menuItemVariants = {
		closed: { opacity: 0, x: -50 },
		open: { opacity: 1, x: 0 },
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
											<Link href="/login">Login/Sign-Up</Link>
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
								{isMobileMenuOpen ? (
									<RiCloseLine size={24} className="text-blue-500" />
								) : (
									<RiMenu3Line size={24} className="text-blue-500" />
								)}
							</button>
						</div>
					</nav>
				</div>
			</header>
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial="closed"
						animate="open"
						exit="closed"
						variants={menuVariants}
						className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto"
					>
						<div className="flex justify-between items-center p-4 border-b">
							<Link href="/">
								<Image
									src="/medicare-logo.png"
									alt="logo"
									height={40}
									width={120}
									className="w-auto"
								/>
							</Link>
							<button onClick={toggleMobileMenu} className="p-2">
								<RiCloseLine size={24} className="text-blue-500" />
							</button>
						</div>
						<ul className="py-2">
							{[
								{ href: "/", label: "Home" },
								{ href: "/doctors", label: "Doctors" },
								{ href: "/services", label: "Services" },
								{ href: "/pages", label: "Pages" },
								{ href: "/blogs", label: "Blogs" },
								{ href: "/contact", label: "Contact Us" },
							].map((item, index) => (
								<motion.li
									key={index}
									variants={menuItemVariants}
									className="border-b"
								>
									<Link
										href={item.href}
										onClick={toggleMobileMenu}
										className="block px-4 py-3 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-500 transition-colors duration-300"
									>
										{item.label}
									</Link>
								</motion.li>
							))}
							<motion.li variants={menuItemVariants} className="px-4 py-3">
								<button
									className="btn w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
									onClick={toggleMobileMenu}
								>
									Schedule Appointments
								</button>
							</motion.li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
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
