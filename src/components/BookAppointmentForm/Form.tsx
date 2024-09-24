"use client";

import React, { useState } from "react";
import Image from "next/image";

const AppointmentForm: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		department: "Department",
		doctor: "Doctor",
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
		<div className="appointment">
			<div className="appointmentInner">
				<div className="flex flex-col md:flex-row">
					<div className="formColumn w-full md:w-1/2 p-4">
						<h2 className="lg:text-[29px] text-[20px] text-[#2c2d3f]">
							Book An Appointment
						</h2>
						<form className="form" onSubmit={handleSubmit}>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="form-group">
									<input
										name="name"
										type="text"
										placeholder="Name"
										value={formData.name}
										onChange={handleInputChange}
										className="outline-none w-full"
									/>
								</div>
								<div className="form-group">
									<input
										name="email"
										type="email"
										placeholder="Email"
										value={formData.email}
										onChange={handleInputChange}
										className="outline-none w-full"
									/>
								</div>
								<div className="form-group">
									<input
										name="phone"
										type="text"
										placeholder="Phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="outline-none w-full"
									/>
								</div>
								<div className="form-group">
									<select
										name="department"
										value={formData.department}
										onChange={handleInputChange}
										className="nice-select outline-none w-full"
									>
										<option value="Department">Department</option>
										<option value="Cardiac Clinic">Cardiac Clinic</option>
										<option value="Neurology">Neurology</option>
										<option value="Dentistry">Dentistry</option>
										<option value="Gastroenterology">Gastroenterology</option>
									</select>
								</div>
								<div className="form-group">
									<select
										name="doctor"
										value={formData.doctor}
										onChange={handleInputChange}
										className="nice-select w-full"
									>
										<option value="Doctor">Select Doctor</option>
										<option value="Dr. Akther Hossain">
											Dr. Akther Hossain
										</option>
										<option value="Dr. Dery Alex">Dr. Dery Alex</option>
										<option value="Dr. Jovis Karon">Dr. Jovis Karon</option>
									</select>
								</div>
								<div className="form-group">
									<input
										name="date"
										type="date"
										placeholder="Date"
										value={formData.date}
										onChange={handleInputChange}
										className="outline-none w-full"
									/>
								</div>
								<div className="form-group sm:col-span-2">
									<textarea
										name="message"
										className="text-area capitalize outline-none w-full"
										placeholder="Write Your Message Here..."
										value={formData.message}
										onChange={handleInputChange}
									></textarea>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
								<div className="buttonGroup">
									<button type="submit" className="btn">
										Book An Appointment
									</button>
								</div>
								<p className="confirmationText">
									( We will confirm by Text Message )
								</p>
							</div>
						</form>
					</div>
					<div className="imageColumn w-full md:w-1/2 p-4 order-first md:order-last">
						<div className="appointmentImage">
							<Image
								src="/contact-img.png"
								alt="Appointment"
								width={500}
								height={500}
								layout="responsive"
								className="w-full h-auto"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppointmentForm;
