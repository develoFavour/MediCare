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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

	const MobileNavContent = () => (
		<motion.div
			initial="closed"
			animate="open"
			exit="closed"
			variants={menuVariants}
			className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white"
		>
			<div className="flex justify-between items-center p-4 border-b border-blue-100">
				<Link href="/">
					<Image
						src="/medicare-logo.png"
						alt="logo"
						height={40}
						width={120}
						className="w-auto"
					/>
				</Link>
			</div>
			<nav className="flex-grow">
				<ul className="py-2 px-4">
					{[
						{ href: "/", label: "Home" },
						{ href: "/doctors", label: "Doctors" },
						{ href: "/services", label: "Services" },
						{ href: "/pages", label: "Pages" },
						{ href: "/blogs", label: "Blogs" },
						{ href: "/contact", label: "Contact Us" },
					].map((item, index) => (
						<motion.li key={index} variants={menuItemVariants} className="mb-4">
							<Link
								href={item.href}
								onClick={toggleMobileMenu}
								className={`block py-3 text-lg font-medium ${
									path === item.href
										? "text-blue-600 bg-blue-100 rounded-lg px-4"
										: "text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 transition-all duration-300"
								}`}
							>
								{item.label}
							</Link>
						</motion.li>
					))}
				</ul>
			</nav>
			<motion.div variants={menuItemVariants} className="p-4 mt-auto">
				<button
					className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
					onClick={toggleMobileMenu}
				>
					Schedule Appointment
				</button>
			</motion.div>
		</motion.div>
	);

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
							<Sheet>
								<SheetTrigger asChild>
									<button className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-300">
										<RiMenu3Line size={28} />
									</button>
								</SheetTrigger>
								<SheetContent
									side="left"
									className="w-[300px] sm:w-[400px] p-0"
								>
									<MobileNavContent />
								</SheetContent>
							</Sheet>
						</div>
					</nav>
				</div>
			</header>
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
