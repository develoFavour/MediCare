"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Search,
	Calendar,
	Clock,
	ChevronRight,
	ChevronLeft,
	ArrowRight,
	MessageCircle,
	Heart,
} from "lucide-react";

// Blog post data
const blogPosts = [
	{
		id: 1,
		title: "10 Tips for Maintaining Heart Health",
		excerpt:
			"Discover simple lifestyle changes that can significantly improve your cardiovascular health and reduce the risk of heart disease.",
		content:
			"Heart disease remains the leading cause of death worldwide, but many cases are preventable through lifestyle modifications. Regular exercise, a balanced diet rich in fruits and vegetables, limited alcohol consumption, and avoiding tobacco are fundamental steps to heart health. Managing stress, getting adequate sleep, and maintaining a healthy weight also contribute significantly to cardiovascular wellness. Regular check-ups with your healthcare provider can help monitor blood pressure, cholesterol levels, and other important markers of heart health.",
		category: "Cardiology",
		author: "Dr. Sarah Johnson",
		date: "June 15, 2024",
		readTime: "8 min read",
		image: "/placeholder.svg?height=600&width=800&text=Heart+Health",
		featured: true,
		tags: ["Heart Health", "Prevention", "Lifestyle"],
		comments: 24,
		likes: 156,
	},
	{
		id: 2,
		title: "Understanding Diabetes: Symptoms, Causes, and Management",
		excerpt:
			"A comprehensive guide to diabetes, including early warning signs, risk factors, and effective strategies for daily management.",
		content:
			"Diabetes is a chronic condition affecting how your body processes blood sugar. Common symptoms include increased thirst, frequent urination, unexplained weight loss, and fatigue. Type 1 diabetes is an autoimmune condition, while Type 2 is largely influenced by lifestyle factors. Management typically involves monitoring blood glucose levels, medication or insulin therapy, regular physical activity, and a carefully planned diet. Regular consultations with healthcare providers are essential for adjusting treatment plans and preventing complications.",
		category: "Endocrinology",
		author: "Dr. Michael Chen",
		date: "May 28, 2024",
		readTime: "12 min read",
		image: "/placeholder.svg?height=600&width=800&text=Diabetes+Management",
		featured: false,
		tags: ["Diabetes", "Chronic Disease", "Health Management"],
		comments: 18,
		likes: 92,
	},
	{
		id: 3,
		title: "The Importance of Mental Health in Overall Wellness",
		excerpt:
			"Exploring the connection between mental and physical health, and strategies for maintaining psychological well-being.",
		content:
			"Mental health is a crucial component of overall wellness, influencing physical health, relationships, and quality of life. Common mental health conditions include anxiety disorders, depression, and stress-related issues. Strategies for maintaining good mental health include regular physical activity, adequate sleep, stress management techniques like meditation, and maintaining social connections. Professional support from therapists or counselors can provide valuable tools for addressing mental health challenges. Reducing stigma around mental health issues is essential for encouraging people to seek help when needed.",
		category: "Mental Health",
		author: "Dr. Emily Rodriguez",
		date: "June 5, 2024",
		readTime: "10 min read",
		image: "/placeholder.svg?height=600&width=800&text=Mental+Health",
		featured: true,
		tags: ["Mental Health", "Wellness", "Self-Care"],
		comments: 42,
		likes: 215,
	},
	{
		id: 4,
		title: "Advances in Cancer Treatment: New Hope for Patients",
		excerpt:
			"Exploring cutting-edge therapies and research breakthroughs that are transforming cancer care and improving outcomes.",
		content:
			"Recent years have seen remarkable advances in cancer treatment, offering new hope to patients. Immunotherapy harnesses the body's immune system to fight cancer cells, while targeted therapies attack specific cancer-causing genetic mutations. Precision medicine allows for personalized treatment plans based on genetic profiles. Minimally invasive surgical techniques reduce recovery time and complications. Clinical trials continue to explore promising new approaches, including CAR T-cell therapy and novel drug combinations. These innovations are significantly improving survival rates and quality of life for many cancer patients.",
		category: "Oncology",
		author: "Dr. Robert Wilson",
		date: "May 12, 2024",
		readTime: "15 min read",
		image: "/placeholder.svg?height=600&width=800&text=Cancer+Treatment",
		featured: false,
		tags: ["Cancer", "Medical Research", "Treatment"],
		comments: 31,
		likes: 178,
	},
	{
		id: 5,
		title: "Nutrition Essentials: Building a Balanced Diet",
		excerpt:
			"Learn the fundamentals of nutrition and how to create a balanced eating plan that supports your health goals and provides essential nutrients for optimal wellness.",
		content:
			"Proper nutrition is the foundation of good health, providing the body with essential nutrients needed for energy, growth, and cellular function. A balanced diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Portion control and mindful eating are key to maintaining a healthy weight. Understanding food labels can help you make informed choices about processed foods. Hydration is also crucial, with water being the best choice for most people. While individual nutritional needs vary based on age, activity level, and health status, the principles of balance, variety, and moderation apply universally.",
		category: "Nutrition",
		author: "Dr. Amanda Taylor",
		date: "June 10, 2024",
		readTime: "9 min read",
		image: "/placeholder.svg?height=600&width=800&text=Nutrition",
		featured: false,
		tags: ["Nutrition", "Diet", "Wellness"],
		comments: 27,
		likes: 143,
	},
	{
		id: 6,
		title: "Sleep Disorders: Causes, Symptoms, and Treatments",
		excerpt:
			"An in-depth look at common sleep disorders, their impact on health, and effective approaches to improving sleep quality.",
		content:
			"Quality sleep is essential for physical and mental health, yet many people suffer from sleep disorders that disrupt this vital function. Insomnia, sleep apnea, restless leg syndrome, and narcolepsy are among the most common sleep disorders. Symptoms may include difficulty falling or staying asleep, excessive daytime sleepiness, irregular breathing during sleep, or unusual movements while sleeping. Treatment approaches vary depending on the specific disorder but may include lifestyle changes, cognitive behavioral therapy, medication, or devices like CPAP machines. Establishing good sleep hygiene practices, such as maintaining a regular sleep schedule and creating a comfortable sleep environment, can benefit most people with sleep concerns.",
		category: "Sleep Medicine",
		author: "Dr. James Peterson",
		date: "May 20, 2024",
		readTime: "11 min read",
		image: "/placeholder.svg?height=600&width=800&text=Sleep+Disorders",
		featured: false,
		tags: ["Sleep", "Health", "Wellness"],
		comments: 19,
		likes: 87,
	},
];

// Categories data
const categories = [
	{ name: "All Categories", count: blogPosts.length },
	{
		name: "Cardiology",
		count: blogPosts.filter((post) => post.category === "Cardiology").length,
	},
	{
		name: "Endocrinology",
		count: blogPosts.filter((post) => post.category === "Endocrinology").length,
	},
	{
		name: "Mental Health",
		count: blogPosts.filter((post) => post.category === "Mental Health").length,
	},
	{
		name: "Oncology",
		count: blogPosts.filter((post) => post.category === "Oncology").length,
	},
	{
		name: "Nutrition",
		count: blogPosts.filter((post) => post.category === "Nutrition").length,
	},
	{
		name: "Sleep Medicine",
		count: blogPosts.filter((post) => post.category === "Sleep Medicine")
			.length,
	},
];

// Popular tags
const popularTags = [
	"Health",
	"Wellness",
	"Prevention",
	"Nutrition",
	"Mental Health",
	"Exercise",
	"Heart Health",
	"Diabetes",
	"Sleep",
	"Cancer",
];

export default function BlogPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All Categories");
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 4;

	// Filter posts based on search query and category
	const filteredPosts = blogPosts.filter((post) => {
		const matchesSearch =
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);

		const matchesCategory =
			selectedCategory === "All Categories" ||
			post.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	// Get featured posts
	const featuredPosts = blogPosts.filter((post) => post.featured);

	// Get current posts for pagination
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

	// Change page
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	// Reset pagination when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedCategory]);

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
							Health & Medical Blog
						</h1>
						<p className="text-xl opacity-90 mb-8">
							Stay informed with the latest health news, medical breakthroughs,
							and wellness tips from our team of healthcare professionals.
						</p>

						<div className="relative max-w-xl mx-auto">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search articles..."
								className="w-full pl-10 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Featured Posts */}
			{featuredPosts.length > 0 &&
				!searchQuery &&
				selectedCategory === "All Categories" && (
					<section className="py-16">
						<div className="container mx-auto px-4">
							<h2 className="text-2xl md:text-3xl font-bold text-[#032b53] mb-8">
								Featured Articles
							</h2>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{featuredPosts.map((post, index) => (
									<motion.div
										key={post.id}
										className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group h-full"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<div className="relative h-64 overflow-hidden">
											<Image
												src={post.image || "/placeholder.svg"}
												alt={post.title}
												fill
												className="object-cover transition-transform duration-700 group-hover:scale-105"
											/>
											<div className="absolute top-4 left-4 bg-[#116aef] text-white text-xs font-bold py-1 px-3 rounded-full">
												Featured
											</div>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
										</div>

										<div className="p-6">
											<div className="flex items-center text-sm text-gray-500 mb-3">
												<span className="bg-blue-100 text-[#116aef] px-2 py-1 rounded-full text-xs font-medium">
													{post.category}
												</span>
												<span className="mx-2">•</span>
												<Calendar className="h-4 w-4 mr-1" />
												<span>{post.date}</span>
												<span className="mx-2">•</span>
												<Clock className="h-4 w-4 mr-1" />
												<span>{post.readTime}</span>
											</div>

											<Link href={`/blogs/${post.id}`}>
												<h3 className="text-2xl font-bold text-[#032b53] mb-3 group-hover:text-[#116aef] transition-colors duration-300">
													{post.title}
												</h3>
											</Link>

											<p className="text-gray-600 mb-4">{post.excerpt}</p>

											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#116aef] font-bold mr-3">
														{post.author
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</div>
													<span className="text-sm font-medium">
														{post.author}
													</span>
												</div>

												<Link
													href={`/blogs/${post.id}`}
													className="inline-flex items-center text-[#116aef] font-medium hover:text-[#0f5ed8] transition-colors duration-300"
												>
													Read More
													<ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
												</Link>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</section>
				)}

			{/* Main Content */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Main Content */}
						<div className="lg:w-2/3">
							<div className="mb-8">
								<h2 className="text-2xl md:text-3xl font-bold text-[#032b53] mb-4">
									{searchQuery
										? `Search Results for "${searchQuery}"`
										: selectedCategory !== "All Categories"
										? `${selectedCategory} Articles`
										: "Latest Articles"}
								</h2>
								<p className="text-gray-600">
									{filteredPosts.length}{" "}
									{filteredPosts.length === 1 ? "article" : "articles"} found
								</p>
							</div>

							{filteredPosts.length === 0 ? (
								<div className="bg-white p-8 rounded-xl shadow-md text-center">
									<Search className="h-12 w-12 text-[#116aef] mx-auto mb-4" />
									<h3 className="text-xl font-semibold text-[#116aef] mb-2">
										No articles found
									</h3>
									<p className="text-gray-600 mb-4">
										We couldn&apos;t find any articles matching your search
										criteria. Please try different keywords or browse all
										articles.
									</p>
									<button
										onClick={() => {
											setSearchQuery("");
											setSelectedCategory("All Categories");
										}}
										className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-6 py-2 rounded-lg transition-colors duration-300"
									>
										Reset Filters
									</button>
								</div>
							) : (
								<motion.div
									className="space-y-8"
									variants={containerVariants}
									initial="hidden"
									animate="visible"
								>
									{currentPosts.map((post) => (
										<motion.div
											key={post.id}
											variants={itemVariants}
											className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group"
										>
											<div className="flex flex-col md:flex-row">
												<div className="md:w-1/3 relative h-48 md:h-auto">
													<Image
														src={post.image || "/placeholder.svg"}
														alt={post.title}
														fill
														className="object-cover transition-transform duration-700 group-hover:scale-105"
													/>
												</div>

												<div className="md:w-2/3 p-6">
													<div className="flex items-center text-sm text-gray-500 mb-3">
														<span className="bg-blue-100 text-[#116aef] px-2 py-1 rounded-full text-xs font-medium">
															{post.category}
														</span>
														<span className="mx-2">•</span>
														<Calendar className="h-4 w-4 mr-1" />
														<span>{post.date}</span>
														<span className="mx-2">•</span>
														<Clock className="h-4 w-4 mr-1" />
														<span>{post.readTime}</span>
													</div>

													<Link href={`/blogs/${post.id}`}>
														<h3 className="text-xl font-bold text-[#032b53] mb-3 group-hover:text-[#116aef] transition-colors duration-300">
															{post.title}
														</h3>
													</Link>

													<p className="text-gray-600 mb-4">{post.excerpt}</p>

													<div className="flex items-center justify-between">
														<div className="flex items-center">
															<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#116aef] font-bold mr-2">
																{post.author
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</div>
															<span className="text-sm font-medium">
																{post.author}
															</span>
														</div>

														<div className="flex items-center space-x-4 text-gray-500">
															<div className="flex items-center">
																<MessageCircle className="h-4 w-4 mr-1" />
																<span className="text-xs">{post.comments}</span>
															</div>
															<div className="flex items-center">
																<Heart className="h-4 w-4 mr-1" />
																<span className="text-xs">{post.likes}</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</motion.div>
							)}

							{/* Pagination */}
							{filteredPosts.length > postsPerPage && (
								<div className="mt-12 flex justify-center">
									<nav className="flex items-center space-x-2">
										<button
											onClick={() =>
												paginate(currentPage > 1 ? currentPage - 1 : 1)
											}
											disabled={currentPage === 1}
											className={`p-2 rounded-md ${
												currentPage === 1
													? "text-gray-400 cursor-not-allowed"
													: "text-[#116aef] hover:bg-blue-50"
											}`}
										>
											<ChevronLeft className="h-5 w-5" />
										</button>

										{Array.from({
											length: Math.ceil(filteredPosts.length / postsPerPage),
										}).map((_, index) => (
											<button
												key={index}
												onClick={() => paginate(index + 1)}
												className={`w-10 h-10 rounded-md ${
													currentPage === index + 1
														? "bg-[#116aef] text-white"
														: "text-gray-700 hover:bg-blue-50"
												}`}
											>
												{index + 1}
											</button>
										))}

										<button
											onClick={() =>
												paginate(
													currentPage <
														Math.ceil(filteredPosts.length / postsPerPage)
														? currentPage + 1
														: Math.ceil(filteredPosts.length / postsPerPage)
												)
											}
											disabled={
												currentPage ===
												Math.ceil(filteredPosts.length / postsPerPage)
											}
											className={`p-2 rounded-md ${
												currentPage ===
												Math.ceil(filteredPosts.length / postsPerPage)
													? "text-gray-400 cursor-not-allowed"
													: "text-[#116aef] hover:bg-blue-50"
											}`}
										>
											<ChevronRight className="h-5 w-5" />
										</button>
									</nav>
								</div>
							)}
						</div>

						{/* Sidebar */}
						<div className="lg:w-1/3 space-y-8">
							{/* Categories */}
							<div className="bg-white rounded-xl shadow-md p-6">
								<h3 className="text-xl font-bold text-[#032b53] mb-4">
									Categories
								</h3>
								<ul className="space-y-2">
									{categories.map((category, index) => (
										<li key={index}>
											<button
												onClick={() => setSelectedCategory(category.name)}
												className={`flex items-center justify-between w-full py-2 px-3 rounded-md transition-colors duration-300 ${
													selectedCategory === category.name
														? "bg-blue-50 text-[#116aef]"
														: "text-gray-700 hover:bg-gray-100"
												}`}
											>
												<span>{category.name}</span>
												<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
													{category.count}
												</span>
											</button>
										</li>
									))}
								</ul>
							</div>

							{/* Popular Tags */}
							<div className="bg-white rounded-xl shadow-md p-6">
								<h3 className="text-xl font-bold text-[#032b53] mb-4">
									Popular Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{popularTags.map((tag, index) => (
										<button
											key={index}
											onClick={() => setSearchQuery(tag)}
											className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-[#116aef] px-3 py-1 rounded-full text-sm transition-colors duration-300"
										>
											{tag}
										</button>
									))}
								</div>
							</div>

							{/* Newsletter */}
							<div className="bg-gradient-to-r from-[#116aef] to-[#5d9eff] rounded-xl shadow-md p-6 text-white">
								<h3 className="text-xl font-bold mb-4">
									Subscribe to Our Newsletter
								</h3>
								<p className="mb-4 opacity-90">
									Stay updated with our latest health articles, tips, and news.
								</p>
								<form className="space-y-4">
									<div>
										<input
											type="email"
											placeholder="Your email address"
											className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
										/>
									</div>
									<button
										type="submit"
										className="w-full bg-white text-[#116aef] py-2 rounded-md font-medium hover:bg-blue-50 transition-colors duration-300"
									>
										Subscribe
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="bg-[#032b53] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-[#116aef]/20 rounded-full -mr-32 -mt-32"></div>
						<div className="absolute bottom-0 left-0 w-64 h-64 bg-[#116aef]/20 rounded-full -ml-32 -mb-32"></div>

						<div className="relative z-10 max-w-3xl mx-auto text-center text-white">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								Have a Health Question?
							</h2>
							<p className="text-xl opacity-90 mb-8">
								Our team of healthcare professionals is ready to help you with
								any medical concerns.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/contact">
									<motion.button
										className="bg-[#116aef] hover:bg-[#0f5ed8] text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Contact Us
									</motion.button>
								</Link>
								<Link href="/book-appointment">
									<motion.button
										className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										Book an Appointment
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
