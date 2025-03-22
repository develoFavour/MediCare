"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	Heart,
	Users,
	Award,
	Clock,
	Calendar,
	ArrowRight,
	Play,
	ChevronRight,
	Star,
} from "lucide-react";
import Link from "next/link";

// Team member data
const teamMembers = [
	{
		id: 1,
		name: "Dr. Sarah Johnson",
		role: "Chief Medical Officer",
		image: "/author1.jpg",
		bio: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She leads our medical team with a focus on patient-centered care and evidence-based medicine.",
		education: "Harvard Medical School",
		specialization: "Cardiology",
	},
	{
		id: 2,
		name: "Dr. Michael Chen",
		role: "Head of Surgery",
		image: "/author2.jpg",
		bio: "Dr. Chen specializes in minimally invasive surgical techniques and has pioneered several innovative procedures. He oversees all surgical departments and ensures the highest standards of surgical care.",
		education: "Johns Hopkins University",
		specialization: "General Surgery",
	},
	{
		id: 3,
		name: "Dr. Emily Rodriguez",
		role: "Director of Pediatrics",
		image: "/author3.jpg",
		bio: "With a passion for children's health, Dr. Rodriguez has dedicated her career to pediatric medicine. She leads our pediatric department with a gentle approach that puts both children and parents at ease.",
		education: "Stanford University",
		specialization: "Pediatrics",
	},
	{
		id: 4,
		name: "Dr. Robert Wilson",
		role: "Neurologist",
		image: "/img/avatar.jpg",
		bio: "Dr. Wilson is a renowned neurologist specializing in the treatment of complex neurological disorders. His research has contributed significantly to advancements in neurology and neurosurgical techniques.",
		education: "Yale University",
		specialization: "Neurology",
	},
];

// Timeline data
const timeline = [
	{
		year: "1985",
		title: "Foundation",
		description:
			"Our healthcare center was established with a mission to provide accessible, high-quality medical care to the community.",
	},
	{
		year: "1995",
		title: "Expansion",
		description:
			"We expanded our facilities to include specialized departments for cardiology, pediatrics, and orthopedics.",
	},
	{
		year: "2005",
		title: "Research Center",
		description:
			"Launched our medical research center to advance healthcare knowledge and develop innovative treatments.",
	},
	{
		year: "2010",
		title: "Technology Integration",
		description:
			"Implemented state-of-the-art medical technology and electronic health records to enhance patient care.",
	},
	{
		year: "2018",
		title: "Community Outreach",
		description:
			"Established community health programs to provide preventive care and health education to underserved populations.",
	},
	{
		year: "2023",
		title: "Global Recognition",
		description:
			"Received international accreditation for excellence in healthcare services and patient safety standards.",
	},
];

// Values data
const values = [
	{
		icon: Heart,
		title: "Compassionate Care",
		description:
			"We treat every patient with empathy, respect, and dignity, recognizing the unique needs of each individual.",
	},
	{
		icon: Users,
		title: "Collaborative Approach",
		description:
			"Our multidisciplinary teams work together to provide comprehensive care that addresses all aspects of health.",
	},
	{
		icon: Award,
		title: "Excellence",
		description:
			"We strive for excellence in everything we do, from medical procedures to patient communication and follow-up care.",
	},
	{
		icon: Clock,
		title: "Accessibility",
		description:
			"We believe quality healthcare should be accessible to all, with convenient hours and multiple service locations.",
	},
];

// Testimonials data
const testimonials = [
	{
		id: 1,
		name: "Jennifer Martinez",
		role: "Patient",
		quote:
			"The care I received was exceptional. The doctors took the time to explain my condition and treatment options, making me feel informed and comfortable throughout the process.",
		rating: 5,
	},
	{
		id: 2,
		name: "David Thompson",
		role: "Patient",
		quote:
			"After struggling with chronic pain for years, the specialists here finally helped me find relief. Their comprehensive approach to treatment has significantly improved my quality of life.",
		rating: 5,
	},
	{
		id: 3,
		name: "Sarah Williams",
		role: "Patient",
		quote:
			"The pediatric team was amazing with my son. They made what could have been a scary experience feel safe and even fun. I couldn't ask for better care for my child.",
		rating: 5,
	},
];

export default function AboutPage() {
	const [activeTestimonial, setActiveTestimonial] = useState(0);
	const [showVideoModal, setShowVideoModal] = useState(false);
	const [selectedTeamMember, setSelectedTeamMember] = useState<number | null>(
		null
	);

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
					<div className="flex flex-col lg:flex-row items-center gap-12">
						<motion.div
							className="lg:w-1/2"
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
						>
							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								About Our Healthcare Center
							</h1>
							<p className="text-xl opacity-90 mb-8">
								For over 35 years, we&apos;ve been dedicated to providing
								exceptional healthcare services with a focus on patient comfort,
								advanced technology, and personalized care.
							</p>
							<div className="flex flex-wrap gap-4">
								<Link href="/services">
									<motion.button
										className="bg-white text-[#116aef] hover:bg-blue-50 px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Our Services
										<ArrowRight className="ml-2 h-5 w-5" />
									</motion.button>
								</Link>
								<motion.button
									className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center"
									onClick={() => setShowVideoModal(true)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Watch Video
									<Play className="ml-2 h-5 w-5" />
								</motion.button>
							</div>
						</motion.div>

						<motion.div
							className="lg:w-1/2"
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
						>
							<div className="relative rounded-xl overflow-hidden shadow-2xl">
								<Image
									src="/about-img.jpg"
									alt="Healthcare Center"
									width={800}
									height={600}
									className="w-full h-auto"
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						<motion.div
							className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
								<Heart className="h-8 w-8 text-[#116aef]" />
							</div>
							<h2 className="text-2xl font-bold text-[#032b53] mb-4">
								Our Mission
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Our mission is to improve the health and wellbeing of the
								communities we serve by providing exceptional, patient-centered
								healthcare services. We are committed to delivering
								compassionate care, advancing medical knowledge through
								research, and promoting health education and prevention.
							</p>
						</motion.div>

						<motion.div
							className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
								<Eye className="h-8 w-8 text-[#116aef]" />
							</div>
							<h2 className="text-2xl font-bold text-[#032b53] mb-4">
								Our Vision
							</h2>
							<p className="text-gray-600 leading-relaxed">
								We envision a future where everyone has access to high-quality
								healthcare, where innovative treatments and technologies
								continuously improve patient outcomes, and where our healthcare
								center is recognized as a leader in medical excellence, patient
								satisfaction, and community wellness.
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Our Values */}
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
							Our Core Values
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							These principles guide our actions and decisions as we work to
							fulfill our mission and achieve our vision.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<motion.div
								key={index}
								className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
									<value.icon className="h-8 w-8 text-[#116aef]" />
								</div>
								<h3 className="text-xl font-bold text-[#032b53] mb-3">
									{value.title}
								</h3>
								<p className="text-gray-600">{value.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Our History */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-4">
							Our Journey Through the Years
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							From our humble beginnings to becoming a leading healthcare
							provider, our history reflects our commitment to excellence and
							innovation.
						</p>
					</motion.div>

					<div className="relative">
						{/* Timeline line */}
						<div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100"></div>

						<div className="space-y-12">
							{timeline.map((item, index) => (
								<motion.div
									key={index}
									className={`flex items-center ${
										index % 2 === 0 ? "flex-row" : "flex-row-reverse"
									} relative`}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
								>
									<div
										className={`w-1/2 ${
											index % 2 === 0 ? "pr-12 text-right" : "pl-12"
										}`}
									>
										<div
											className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${
												index % 2 === 0 ? "ml-auto" : "mr-auto"
											} max-w-md`}
										>
											<span className="text-[#116aef] font-bold text-lg">
												{item.year}
											</span>
											<h3 className="text-xl font-bold text-[#032b53] mb-2">
												{item.title}
											</h3>
											<p className="text-gray-600">{item.description}</p>
										</div>
									</div>

									<div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#116aef] rounded-full flex items-center justify-center z-10">
										<span className="text-white font-bold">
											{item.year.substring(2)}
										</span>
									</div>

									<div className="w-1/2"></div>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Meet Our Team */}
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
							Meet Our Medical Team
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Our team of experienced healthcare professionals is dedicated to
							providing exceptional care with compassion and expertise.
						</p>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
					>
						{teamMembers.map((member) => (
							<motion.div
								key={member.id}
								variants={itemVariants}
								className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
							>
								<div className="relative h-64 overflow-hidden">
									<Image
										src={member.image || "/placeholder.svg"}
										alt={member.name}
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								</div>

								<div className="p-6">
									<h3 className="text-xl font-bold text-[#032b53] group-hover:text-[#116aef] transition-colors duration-300">
										{member.name}
									</h3>
									<p className="text-[#116aef] font-medium mb-4">
										{member.role}
									</p>
									<p className="text-gray-600 mb-4 line-clamp-3">
										{member.bio}
									</p>

									<button
										onClick={() => setSelectedTeamMember(member.id)}
										className="inline-flex items-center text-[#116aef] font-medium hover:text-[#0f5ed8] transition-colors duration-300"
									>
										View Profile
										<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
									</button>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 bg-gradient-to-r from-[#032b53] to-[#116aef] text-white">
				<div className="container mx-auto px-4">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							What Our Patients Say
						</h2>
						<p className="text-white/80 max-w-2xl mx-auto">
							Read testimonials from patients who have experienced our care
							firsthand.
						</p>
					</motion.div>

					<div className="max-w-4xl mx-auto">
						<div className="relative">
							{testimonials.map((testimonial, index) => (
								<motion.div
									key={testimonial.id}
									className={`bg-white/10 backdrop-blur-sm p-8 rounded-xl ${
										activeTestimonial === index ? "block" : "hidden"
									}`}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.4 }}
								>
									<div className="flex justify-center mb-6">
										<div className="flex">
											{[...Array(testimonial.rating)].map((_, i) => (
												<Star
													key={i}
													className="h-6 w-6 text-yellow-400 fill-current"
												/>
											))}
										</div>
									</div>

									<blockquote className="text-xl italic text-center mb-6">
										&apos;{testimonial.quote}&apos;
									</blockquote>

									<div className="flex flex-col items-center">
										<div className="w-16 h-16 rounded-full bg-[#116aef] flex items-center justify-center text-white font-bold text-xl mb-3">
											{testimonial.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</div>
										<div className="text-center">
											<h4 className="font-bold text-lg">{testimonial.name}</h4>
											<p className="text-white/70">{testimonial.role}</p>
										</div>
									</div>
								</motion.div>
							))}

							<div className="flex justify-center mt-8">
								{testimonials.map((_, index) => (
									<button
										key={index}
										onClick={() => setActiveTestimonial(index)}
										className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
											activeTestimonial === index
												? "bg-white scale-125"
												: "bg-white/50 hover:bg-white/70"
										}`}
										aria-label={`View testimonial ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="bg-white rounded-xl shadow-lg p-8 md:p-12 relative overflow-hidden border border-gray-100">
						<div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32"></div>
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32"></div>

						<div className="relative z-10 max-w-3xl mx-auto text-center">
							<h2 className="text-3xl md:text-4xl font-bold text-[#032b53] mb-6">
								Ready to Experience Our Care?
							</h2>
							<p className="text-xl text-gray-600 mb-8">
								Schedule an appointment with our specialists today and take the
								first step towards better health.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/book-appointment">
									<motion.button
										className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Calendar className="mr-2 h-5 w-5" />
										Book an Appointment
									</motion.button>
								</Link>
								<Link href="/contact">
									<motion.button
										className="border border-gray-300 hover:border-[#116aef] text-gray-700 hover:text-[#116aef] px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Contact Us
										<ChevronRight className="ml-2 h-5 w-5" />
									</motion.button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Video Modal */}
			{showVideoModal && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<motion.div
						className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
					>
						<div className="flex justify-between items-center p-4 border-b border-gray-100">
							<h3 className="text-xl font-bold text-[#032b53]">
								About Our Healthcare Center
							</h3>
							<button
								className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
								onClick={() => setShowVideoModal(false)}
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
						</div>

						<div className="relative pt-[56.25%]">
							<div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
								<Play className="h-16 w-16 text-[#116aef]" />
								<span className="ml-2 text-gray-600">Video placeholder</span>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Team Member Modal */}
			{selectedTeamMember && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
					<motion.div
						className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
					>
						{teamMembers
							.filter((member) => member.id === selectedTeamMember)
							.map((member) => (
								<div key={member.id} className="relative">
									<button
										className="absolute top-4 right-4 bg-white/80 p-2 rounded-full z-10 hover:bg-white transition-colors duration-300"
										onClick={() => setSelectedTeamMember(null)}
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

									<div className="flex flex-col md:flex-row">
										<div className="md:w-1/3 relative h-64 md:h-auto">
											<Image
												src={member.image || "/placeholder.svg"}
												alt={member.name}
												fill
												className="object-cover"
											/>
										</div>

										<div className="md:w-2/3 p-6">
											<h2 className="text-2xl font-bold text-[#032b53] mb-1">
												{member.name}
											</h2>
											<p className="text-[#116aef] font-medium mb-4">
												{member.role}
											</p>

											<div className="space-y-4 mb-6">
												<div className="flex items-start">
													<div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
														<Award className="h-5 w-5 text-[#116aef]" />
													</div>
													<div>
														<h4 className="font-semibold">Education</h4>
														<p className="text-gray-600">{member.education}</p>
													</div>
												</div>

												<div className="flex items-start">
													<div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
														<Stethoscope className="h-5 w-5 text-[#116aef]" />
													</div>
													<div>
														<h4 className="font-semibold">Specialization</h4>
														<p className="text-gray-600">
															{member.specialization}
														</p>
													</div>
												</div>
											</div>

											<h3 className="text-xl font-bold text-[#032b53] mb-3">
												Biography
											</h3>
											<p className="text-gray-600 mb-6">{member.bio}</p>

											<Link href="/book-appointment">
												<button className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center">
													Book Appointment with Dr. {member.name.split(" ")[1]}
													<ArrowRight className="ml-2 h-4 w-4" />
												</button>
											</Link>
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

function Eye(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function Stethoscope(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
			<path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
			<circle cx="20" cy="10" r="2" />
		</svg>
	);
}
