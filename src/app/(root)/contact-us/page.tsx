"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	Send,
	CheckCircle,
	MessageSquare,
	User,
	AtSign,
	FileText,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
	const [formState, setFormState] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));

		// Clear error when user types
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!formState.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formState.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!formState.subject.trim()) {
			newErrors.subject = "Subject is required";
		}

		if (!formState.message.trim()) {
			newErrors.message = "Message is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSubmitted(true);

			// Reset form after 3 seconds
			setTimeout(() => {
				setIsSubmitted(false);
				setFormState({
					name: "",
					email: "",
					phone: "",
					subject: "",
					message: "",
				});
			}, 5000);
		}, 1500);
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
						<h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
						<p className="text-xl opacity-90 mb-8">
							We&apos;re here to help with any questions or concerns about our
							healthcare services. Reach out to us and we&apos;ll respond as
							soon as we can.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Contact Information */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<motion.div
							className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Phone className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-2">Phone</h3>
							<p className="text-gray-600 mb-2">Call us directly at</p>
							<a
								href="tel:+15551234567"
								className="text-[#116aef] font-medium hover:underline"
							>
								+1 (555) 123-4567
							</a>
						</motion.div>

						<motion.div
							className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Mail className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-2">Email</h3>
							<p className="text-gray-600 mb-2">Send us an email at</p>
							<a
								href="mailto:info@healthcare.com"
								className="text-[#116aef] font-medium hover:underline"
							>
								info@healthcare.com
							</a>
						</motion.div>

						<motion.div
							className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<MapPin className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-2">
								Location
							</h3>
							<p className="text-gray-600 mb-2">Visit us at</p>
							<address className="text-[#116aef] font-medium not-italic">
								123 Healthcare Ave
								<br />
								Medical City, MC 10001
							</address>
						</motion.div>

						<motion.div
							className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.4 }}
						>
							<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="h-8 w-8 text-[#116aef]" />
							</div>
							<h3 className="text-xl font-bold text-[#032b53] mb-2">Hours</h3>
							<p className="text-gray-600 mb-2">We&apos;re available</p>
							<p className="text-[#116aef] font-medium">
								Mon-Fri: 8:00 AM - 6:00 PM
								<br />
								Sat: 9:00 AM - 1:00 PM
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Contact Form and Map */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<div className="bg-white rounded-xl shadow-md p-8">
								<h2 className="text-2xl md:text-3xl font-bold text-[#032b53] mb-6">
									Send Us a Message
								</h2>

								{isSubmitted ? (
									<motion.div
										className="text-center py-8"
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3 }}
									>
										<div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
											<CheckCircle className="h-10 w-10 text-green-500" />
										</div>
										<h3 className="text-xl font-bold text-[#032b53] mb-4">
											Message Sent Successfully!
										</h3>
										<p className="text-gray-600 mb-6">
											Thank you for reaching out to us. We&apos;ve received your
											message and will get back to you shortly.
										</p>
									</motion.div>
								) : (
									<form onSubmit={handleSubmit} className="space-y-6">
										<div>
											<label className="block text-gray-700 mb-2 font-medium">
												Full Name
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<User className="h-5 w-5 text-gray-400" />
												</div>
												<input
													type="text"
													name="name"
													value={formState.name}
													onChange={handleChange}
													className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#116aef] focus:border-[#116aef] outline-none transition-all ${
														errors.name ? "border-red-500" : "border-gray-300"
													}`}
													placeholder="John Doe"
												/>
											</div>
											{errors.name && (
												<p className="text-red-500 text-sm mt-1">
													{errors.name}
												</p>
											)}
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label className="block text-gray-700 mb-2 font-medium">
													Email Address
												</label>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<AtSign className="h-5 w-5 text-gray-400" />
													</div>
													<input
														type="email"
														name="email"
														value={formState.email}
														onChange={handleChange}
														className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#116aef] focus:border-[#116aef] outline-none transition-all ${
															errors.email
																? "border-red-500"
																: "border-gray-300"
														}`}
														placeholder="johndoe@example.com"
													/>
												</div>
												{errors.email && (
													<p className="text-red-500 text-sm mt-1">
														{errors.email}
													</p>
												)}
											</div>

											<div>
												<label className="block text-gray-700 mb-2 font-medium">
													Phone (Optional)
												</label>
												<div className="relative">
													<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
														<Phone className="h-5 w-5 text-gray-400" />
													</div>
													<input
														type="tel"
														name="phone"
														value={formState.phone}
														onChange={handleChange}
														className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#116aef] focus:border-[#116aef] outline-none transition-all"
														placeholder="(555) 123-4567"
													/>
												</div>
											</div>
										</div>

										<div>
											<label className="block text-gray-700 mb-2 font-medium">
												Subject
											</label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
													<FileText className="h-5 w-5 text-gray-400" />
												</div>
												<input
													type="text"
													name="subject"
													value={formState.subject}
													onChange={handleChange}
													className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#116aef] focus:border-[#116aef] outline-none transition-all ${
														errors.subject
															? "border-red-500"
															: "border-gray-300"
													}`}
													placeholder="How can we help you?"
												/>
											</div>
											{errors.subject && (
												<p className="text-red-500 text-sm mt-1">
													{errors.subject}
												</p>
											)}
										</div>

										<div>
											<label className="block text-gray-700 mb-2 font-medium">
												Message
											</label>
											<div className="relative">
												<div className="absolute top-3 left-3 pointer-events-none">
													<MessageSquare className="h-5 w-5 text-gray-400" />
												</div>
												<textarea
													name="message"
													value={formState.message}
													onChange={handleChange}
													rows={5}
													className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#116aef] focus:border-[#116aef] outline-none transition-all ${
														errors.message
															? "border-red-500"
															: "border-gray-300"
													}`}
													placeholder="Please provide details about your inquiry..."
												></textarea>
											</div>
											{errors.message && (
												<p className="text-red-500 text-sm mt-1">
													{errors.message}
												</p>
											)}
										</div>

										<div>
											<button
												type="submit"
												disabled={isSubmitting}
												className="w-full bg-[#116aef] hover:bg-[#0f5ed8] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
											>
												{isSubmitting ? (
													<>
														<svg
															className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
														>
															<circle
																className="opacity-25"
																cx="12"
																cy="12"
																r="10"
																stroke="currentColor"
																strokeWidth="4"
															></circle>
															<path
																className="opacity-75"
																fill="currentColor"
																d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
															></path>
														</svg>
														Sending Message...
													</>
												) : (
													<>
														Send Message
														<Send className="ml-2 h-5 w-5" />
													</>
												)}
											</button>
										</div>
									</form>
								)}
							</div>
						</motion.div>

						{/* Map */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
								<div className="p-6 border-b border-gray-100">
									<h2 className="text-2xl font-bold text-[#032b53]">
										Our Location
									</h2>
									<p className="text-gray-600">
										Visit us at our main medical center
									</p>
								</div>

								<div className="relative h-[400px] bg-gray-200">
									{/* Replace with actual map component or iframe */}
									<div className="absolute inset-0 flex items-center justify-center bg-gray-200">
										<MapPin className="h-12 w-12 text-[#116aef]" />
										<span className="ml-2 text-gray-600">Map placeholder</span>
									</div>
								</div>

								<div className="p-6">
									<h3 className="text-xl font-bold text-[#032b53] mb-4">
										Directions
									</h3>
									<div className="space-y-4">
										<div className="flex items-start">
											<div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
												<MapPin className="h-5 w-5 text-[#116aef]" />
											</div>
											<div>
												<h4 className="font-semibold">Address</h4>
												<p className="text-gray-600">
													123 Healthcare Ave, Medical City, MC 10001
												</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
												<Clock className="h-5 w-5 text-[#116aef]" />
											</div>
											<div>
												<h4 className="font-semibold">Parking</h4>
												<p className="text-gray-600">
													Free parking available for patients and visitors
												</p>
											</div>
										</div>

										<div className="flex items-start">
											<div className="bg-blue-50 p-2 rounded-full mr-3 flex-shrink-0">
												<Mail className="h-5 w-5 text-[#116aef]" />
											</div>
											<div>
												<h4 className="font-semibold">Public Transportation</h4>
												<p className="text-gray-600">
													Bus routes 10, 15, and 22 stop directly in front of
													our facility
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
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
							Frequently Asked Questions
						</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Find answers to common questions about our services, appointments,
							and policies.
						</p>
					</motion.div>

					<div className="max-w-3xl mx-auto">
						<div className="space-y-6">
							{[
								{
									question: "How do I schedule an appointment?",
									answer:
										"You can schedule an appointment by calling our office, using our online booking system, or sending us a message through this contact form. Our staff will get back to you promptly to confirm your appointment time.",
								},
								{
									question: "What insurance plans do you accept?",
									answer:
										"We accept most major insurance plans, including Medicare and Medicaid. Please contact our office with your specific insurance information to verify coverage before your appointment.",
								},
								{
									question: "What should I bring to my first appointment?",
									answer:
										"Please bring your insurance card, photo ID, a list of current medications, medical records if available, and any referral forms if required by your insurance. Arriving 15 minutes early to complete paperwork is recommended.",
								},
								{
									question: "Do you offer telehealth services?",
									answer:
										"Yes, we offer telehealth appointments for certain types of consultations and follow-up visits. Please call our office to determine if your medical concern is appropriate for a virtual visit.",
								},
								{
									question: "What are your payment policies?",
									answer:
										"Co-payments are due at the time of service. We accept cash, checks, and most major credit cards. For patients without insurance or with high deductibles, we offer payment plans. Please discuss financial concerns with our billing department.",
								},
							].map((faq, index) => (
								<motion.div
									key={index}
									className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
								>
									<details className="group">
										<summary className="flex items-center justify-between cursor-pointer p-6">
											<h3 className="text-lg font-semibold text-[#032b53]">
												{faq.question}
											</h3>
											<span className="transition-transform duration-300 group-open:rotate-180">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5 text-[#116aef]"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</span>
										</summary>
										<div className="px-6 pb-6 pt-0">
											<p className="text-gray-600">{faq.answer}</p>
										</div>
									</details>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="bg-gradient-to-r from-[#116aef] to-[#5d9eff] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

						<div className="relative z-10 max-w-3xl mx-auto text-center text-white">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Need Urgent Medical Attention?
							</h2>
							<p className="text-xl opacity-90 mb-8">
								Our emergency services are available 24/7. For medical
								emergencies, please call our emergency hotline.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a href="tel:+15559112">
									<motion.button
										className="bg-white text-[#116aef] hover:bg-blue-50 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Phone className="mr-2 h-5 w-5" />
										Emergency: (555) 911-2
									</motion.button>
								</a>
								<Link href="/book-appointment">
									<motion.button
										className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Book an Appointment
										<ArrowRight className="ml-2 h-5 w-5" />
									</motion.button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
