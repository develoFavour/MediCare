"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	Heart,
	Brain,
	Stethoscope,
	Pill,
	Bone,
	Eye,
	SmileIcon as Tooth,
	Baby,
	Microscope,
	Activity,
	Search,
	ArrowRight,
	CheckCircle,
	Users,
	Award,
	Clock,
} from "lucide-react";
import Link from "next/link";

// Service category data
const categories = [
	{ id: "all", name: "All Services" },
	{ id: "cardiology", name: "Cardiology" },
	{ id: "neurology", name: "Neurology" },
	{ id: "primary", name: "Primary Care" },
	{ id: "pharmacy", name: "Pharmacy" },
	{ id: "orthopedics", name: "Orthopedics" },
	{ id: "ophthalmology", name: "Ophthalmology" },
	{ id: "dental", name: "Dental" },
	{ id: "pediatrics", name: "Pediatrics" },
	{ id: "laboratory", name: "Laboratory" },
];

// Service data
const services = [
	{
		id: 1,
		title: "Cardiac Rehabilitation",
		category: "cardiology",
		description:
			"Comprehensive program to improve cardiovascular health after heart attack or surgery.",
		icon: Heart,
		image: "/placeholder.svg?height=400&width=600&text=Cardiac+Rehabilitation",
		features: [
			"Personalized exercise programs",
			"Nutrition counseling",
			"Stress management",
			"Education sessions",
		],
		popular: true,
	},
	{
		id: 2,
		title: "Neurological Disorders Treatment",
		category: "neurology",
		description:
			"Specialized care for conditions affecting the brain, spinal cord, and nervous system.",
		icon: Brain,
		image: "/placeholder.svg?height=400&width=600&text=Neurological+Treatment",
		features: [
			"Stroke management",
			"Epilepsy treatment",
			"Headache clinic",
			"Movement disorders",
		],
	},
	{
		id: 3,
		title: "Primary Care Consultations",
		category: "primary",
		description: "Comprehensive healthcare services for patients of all ages.",
		icon: Stethoscope,
		image: "/placeholder.svg?height=400&width=600&text=Primary+Care",
		features: [
			"Preventive care",
			"Chronic disease management",
			"Immunizations",
			"Health screenings",
		],
	},
	{
		id: 4,
		title: "Medication Management",
		category: "pharmacy",
		description:
			"Expert guidance on medication use, interactions, and management.",
		icon: Pill,
		image: "/placeholder.svg?height=400&width=600&text=Medication+Management",
		features: [
			"Prescription services",
			"Medication review",
			"Compounding services",
			"Medication synchronization",
		],
	},
	{
		id: 5,
		title: "Orthopedic Surgery",
		category: "orthopedics",
		description:
			"Surgical and non-surgical treatments for musculoskeletal issues.",
		icon: Bone,
		image: "/placeholder.svg?height=400&width=600&text=Orthopedic+Surgery",
		features: [
			"Joint replacement",
			"Sports medicine",
			"Fracture care",
			"Spine surgery",
		],
		popular: true,
	},
	{
		id: 6,
		title: "Vision Correction",
		category: "ophthalmology",
		description:
			"Advanced procedures to improve vision and treat eye conditions.",
		icon: Eye,
		image: "/placeholder.svg?height=400&width=600&text=Vision+Correction",
		features: [
			"LASIK surgery",
			"Cataract removal",
			"Glaucoma treatment",
			"Retinal care",
		],
	},
	{
		id: 7,
		title: "Dental Implants",
		category: "dental",
		description:
			"Permanent solution for missing teeth with natural-looking results.",
		icon: Tooth,
		image: "/placeholder.svg?height=400&width=600&text=Dental+Implants",
		features: [
			"Single tooth replacement",
			"Full arch restoration",
			"Bone grafting",
			"3D imaging",
		],
	},
	{
		id: 8,
		title: "Pediatric Wellness",
		category: "pediatrics",
		description:
			"Comprehensive healthcare services specifically for children and adolescents.",
		icon: Baby,
		image: "/placeholder.svg?height=400&width=600&text=Pediatric+Wellness",
		features: [
			"Well-child visits",
			"Developmental screening",
			"Immunizations",
			"Behavioral health",
		],
	},
	{
		id: 9,
		title: "Diagnostic Testing",
		category: "laboratory",
		description:
			"Advanced laboratory services for accurate diagnosis and treatment planning.",
		icon: Microscope,
		image: "/placeholder.svg?height=400&width=600&text=Diagnostic+Testing",
		features: ["Blood work", "Genetic testing", "Pathology", "Microbiology"],
	},
	{
		id: 10,
		title: "Cardiac Imaging",
		category: "cardiology",
		description:
			"Non-invasive imaging techniques to evaluate heart structure and function.",
		icon: Activity,
		image: "/placeholder.svg?height=400&width=600&text=Cardiac+Imaging",
		features: [
			"Echocardiography",
			"Cardiac CT",
			"Cardiac MRI",
			"Nuclear cardiology",
		],
	},
];

// Stats data
const stats = [
	{ value: "25+", label: "Years of Experience" },
	{ value: "50k+", label: "Satisfied Patients" },
	{ value: "200+", label: "Medical Professionals" },
	{ value: "15+", label: "Specialized Departments" },
];

export default function ServicesPage() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedService, setSelectedService] = useState<number | null>(null);

	// Filter services based on category and search query
	const filteredServices = services.filter((service) => {
		const matchesCategory =
			activeCategory === "all" || service.category === activeCategory;
		const matchesSearch =
			service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			service.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	};

	return (
		<main className="min-h-screen">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-[#032b53] to-[#116aef] text-white py-24 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -right-20 -top-20 w-80 h-80 bg-[#5d9eff]/20 rounded-full"></div>
					<div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#5d9eff]/20 rounded-full"></div>
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<motion.div
						className="max-w-3xl mx-auto text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Our Healthcare Services
						</h1>
						<p className="text-xl opacity-90 mb-8">
							We provide a wide range of medical services to meet your
							healthcare needs, delivered by experienced professionals using
							state-of-the-art technology.
						</p>

						<div className="relative max-w-xl mx-auto">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search for services..."
								className="w-full pl-10 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-8 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap justify-center gap-3">
						{categories.map((category) => (
							<motion.button
								key={category.id}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
									activeCategory === category.id
										? "bg-[#116aef] text-white shadow-md"
										: "bg-white text-gray-700 hover:bg-gray-100"
								}`}
								onClick={() => setActiveCategory(category.id)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{category.name}
							</motion.button>
						))}
					</div>
				</div>
			</section>

			{/* Services Grid */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					{filteredServices.length === 0 ? (
						<div className="text-center py-12">
							<div className="bg-blue-50 p-8 rounded-lg max-w-md mx-auto">
								<Search className="h-12 w-12 text-[#116aef] mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-[#116aef] mb-2">
									No services found
								</h3>
								<p className="text-gray-600 mb-4">
									We couldn&apos;t find any services matching your search
									criteria. Please try different keywords or browse all
									services.
								</p>
								<button
									onClick={() => {
										setSearchQuery("");
										setActiveCategory("all");
									}}
									className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-6 py-2 rounded-lg transition-colors duration-300"
								>
									Reset Filters
								</button>
							</div>
						</div>
					) : (
						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
							variants={containerVariants}
							initial="hidden"
							animate="visible"
						>
							{filteredServices.map((service) => (
								<motion.div
									key={service.id}
									variants={itemVariants}
									className={`bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group ${
										service.popular ? "ring-2 ring-[#116aef]" : ""
									}`}
								>
									<div className="relative h-48 overflow-hidden">
										<Image
											src={service.image || "/placeholder.svg"}
											alt={service.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-105"
										/>
										{service.popular && (
											<div className="absolute top-4 right-4 bg-[#116aef] text-white text-xs font-bold py-1 px-3 rounded-full">
												Popular
											</div>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
											<div className="p-4 w-full">
												<button
													onClick={() => setSelectedService(service.id)}
													className="w-full bg-white text-[#116aef] py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300"
												>
													View Details
												</button>
											</div>
										</div>
									</div>

									<div className="p-6">
										<div className="flex items-center mb-4">
											<div className="bg-blue-50 p-2 rounded-lg mr-4">
												<service.icon className="h-6 w-6 text-[#116aef]" />
											</div>
											<h3 className="text-xl font-bold text-[#032b53] group-hover:text-[#116aef] transition-colors duration-300">
												{service.title}
											</h3>
										</div>

										<p className="text-gray-600 mb-4">{service.description}</p>

										<button
											onClick={() => setSelectedService(service.id)}
											className="inline-flex items-center text-[#116aef] font-medium hover:text-[#0f5ed8] transition-colors duration-300"
										>
											Learn More
											<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
										</button>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-gradient-to-r from-[#032b53] to-[#116aef] text-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								className="text-center"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<div className="text-4xl md:text-5xl font-bold mb-2">
									{stat.value}
								</div>
								<div className="text-blue-100">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-4">
							Why Choose Our Medical Services
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							We are committed to providing exceptional healthcare services with
							a focus on patient comfort, advanced technology, and personalized
							care.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<motion.div
							className="bg-white p-8 rounded-xl shadow-md"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
								<Users className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-4">
								Expert Medical Team
							</h3>
							<p className="text-gray-600">
								Our healthcare professionals are leaders in their fields,
								bringing years of experience and specialized knowledge to
								provide the highest quality care.
							</p>
						</motion.div>

						<motion.div
							className="bg-white p-8 rounded-xl shadow-md"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
								<Award className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-4">
								Advanced Technology
							</h3>
							<p className="text-gray-600">
								We invest in cutting-edge medical technology and equipment to
								ensure accurate diagnosis and effective treatment for all our
								patients.
							</p>
						</motion.div>

						<motion.div
							className="bg-white p-8 rounded-xl shadow-md"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
								<Clock className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-4">
								Patient-Centered Care
							</h3>
							<p className="text-gray-600">
								We prioritize your comfort and well-being, creating personalized
								treatment plans that address your unique healthcare needs and
								concerns.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="bg-gradient-to-r from-[#116aef] to-[#5d9eff] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

						<div className="relative z-10 max-w-3xl mx-auto text-center text-white">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Ready to Experience Our Services?
							</h2>
							<p className="text-xl opacity-90 mb-8">
								Schedule an appointment with our specialists today and take the
								first step towards better health.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/book-appointment">
									<motion.button
										className="bg-white text-[#116aef] hover:bg-blue-50 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Book an Appointment
									</motion.button>
								</Link>
								<Link href="/contact">
									<motion.button
										className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Contact Us
									</motion.button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Service Detail Modal */}
			{selectedService && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<motion.div
						className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
					>
						{services
							.filter((service) => service.id === selectedService)
							.map((service) => (
								<div key={service.id} className="relative">
									<button
										className="absolute top-4 right-4 bg-white/80 p-2 rounded-full z-10 hover:bg-white transition-colors duration-300"
										onClick={() => setSelectedService(null)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-gray-800"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>

									<div className="relative h-64">
										<Image
											src={service.image || "/placeholder.svg"}
											alt={service.title}
											fill
											className="object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
											<div className="p-6">
												<h2 className="text-3xl font-bold text-white">
													{service.title}
												</h2>
											</div>
										</div>
									</div>

									<div className="p-6">
										<div className="flex items-center mb-6">
											<div className="bg-blue-50 p-3 rounded-lg mr-4">
												<service.icon className="h-8 w-8 text-[#116aef]" />
											</div>
											<div>
												<h3 className="text-2xl font-bold text-[#032b53]">
													{service.title}
												</h3>
												<p className="text-gray-500">
													Department of{" "}
													{
														categories.find(
															(cat) => cat.id === service.category
														)?.name
													}
												</p>
											</div>
										</div>

										<p className="text-gray-700 mb-6 text-lg">
											{service.description}
										</p>

										<div className="mb-8">
											<h4 className="text-xl font-bold text-[#032b53] mb-4">
												Key Features
											</h4>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{service.features.map((feature, index) => (
													<div key={index} className="flex items-start">
														<CheckCircle className="h-5 w-5 text-[#116aef] mt-0.5 mr-3 flex-shrink-0" />
														<span className="text-gray-700">{feature}</span>
													</div>
												))}
											</div>
										</div>

										<div className="border-t border-gray-200 pt-6 mt-6">
											<h4 className="text-xl font-bold text-[#032b53] mb-4">
												Ready to Get Started?
											</h4>
											<div className="flex flex-col sm:flex-row gap-4">
												<Link href="/book-appointment">
													<button className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center">
														Book This Service
														<ArrowRight className="ml-2 h-4 w-4" />
													</button>
												</Link>
												<Link href="/contact">
													<button className="border border-gray-300 hover:border-[#116aef] text-gray-700 hover:text-[#116aef] px-6 py-3 rounded-lg font-medium transition-colors duration-300">
														Request More Information
													</button>
												</Link>
											</div>
										</div>
									</div>
								</div>
							))}
					</motion.div>
				</div>
			)}
		</main>
	);
}
