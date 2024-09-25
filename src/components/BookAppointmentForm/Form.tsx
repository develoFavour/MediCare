"use client";

import React, { useState } from "react";
import Image from "next/image";

const AppointmentForm: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		department: "",
		doctor: "",
		date: "",
		message: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Handle form submission logic here
		console.log(formData);
	};

	return (
		<div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row items-center justify-between">
					<div className="w-full lg:w-1/2 mb-12 lg:mb-0">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							Book Your Appointment
						</h2>
						<p className="text-lg text-gray-600 mb-8">
							Take the first step towards better health. Schedule your visit
							with our expert medical team today.
						</p>
						<div className="hidden lg:block">
							<Image
								src="/contact-img.png"
								alt="Appointment"
								width={500}
								height={500}
								className="rounded-lg shadow-xl"
							/>
						</div>
					</div>
					<div className="w-full lg:w-1/2">
						<form
							onSubmit={handleSubmit}
							className="bg-white shadow-2xl rounded-lg p-8"
						>
							<div className="grid grid-cols-1 gap-6">
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700"
									>
										Full Name
									</label>
									<input
										type="text"
										name="name"
										id="name"
										value={formData.name}
										onChange={handleInputChange}
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										required
									/>
								</div>
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700"
									>
										Email Address
									</label>
									<input
										type="email"
										name="email"
										id="email"
										value={formData.email}
										onChange={handleInputChange}
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										required
									/>
								</div>
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="phone"
										className="block text-sm font-medium text-gray-700"
									>
										Phone Number
									</label>
									<input
										type="tel"
										name="phone"
										id="phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										required
									/>
								</div>
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="department"
										className="block text-sm font-medium text-gray-700"
									>
										Department
									</label>
									<select
										name="department"
										id="department"
										value={formData.department}
										onChange={handleInputChange}
										className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										required
									>
										<option value="">Select Department</option>
										<option value="Cardiac Clinic">Cardiac Clinic</option>
										<option value="Neurology">Neurology</option>
										<option value="Dentistry">Dentistry</option>
										<option value="Gastroenterology">Gastroenterology</option>
									</select>
								</div>
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="doctor"
										className="block text-sm font-medium text-gray-700"
									>
										Doctor
									</label>
									<select
										name="doctor"
										id="doctor"
										value={formData.doctor}
										onChange={handleInputChange}
										className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										required
									>
										<option value="">Select Doctor</option>
										<option value="Dr. Akther Hossain">
											Dr. Akther Hossain
										</option>
										<option value="Dr. Dery Alex">Dr. Dery Alex</option>
										<option value="Dr. Jovis Karon">Dr. Jovis Karon</option>
									</select>
								</div>
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="date"
										className="block text-sm font-medium text-gray-700"
									>
										Preferred Date
									</label>
									<input
										type="date"
										name="date"
										id="date"
										value={formData.date}
										onChange={handleInputChange}
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
										required
									/>
								</div>
								<div className="col-span-1 sm:col-span-2">
									<label
										htmlFor="message"
										className="block text-sm font-medium text-gray-700"
									>
										Additional Information
									</label>
									<textarea
										name="message"
										id="message"
										rows={4}
										value={formData.message}
										onChange={handleInputChange}
										className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
									></textarea>
								</div>
							</div>
							<div className="mt-6">
								<button
									type="submit"
									className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
								>
									Book Appointment
								</button>
							</div>
							<p className="mt-4 text-center text-sm text-gray-500">
								We will confirm your appointment via SMS
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppointmentForm;
