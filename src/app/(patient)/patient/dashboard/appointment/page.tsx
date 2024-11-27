"use client";

import { useState } from "react";
import "@/app/(root)/globals.css";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

export default function BookAppointmentPage() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [reason, setReason] = useState("");

	const handleBookAppointment = async () => {
		if (!date || !reason) {
			toast.error(
				"Please select a date and provide a reason for your appointment."
			);
			return;
		}

		// Here you would typically make an API call to book the appointment
		// For now, we'll just simulate a successful booking
		toast.success(
			"Appointment request submitted successfully. You will be notified once a doctor is assigned."
		);
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-6 text-[#116aef]">
				Book an Appointment
			</h1>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<h2 className="text-lg font-semibold mb-2">Select a Date</h2>
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						className="rounded-md border"
					/>
				</div>
				<div>
					<h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="reason"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Reason for Appointment
							</label>
							<Textarea
								id="reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="Please describe your symptoms or reason for the appointment"
								className="w-full"
							/>
						</div>
						<Button
							onClick={handleBookAppointment}
							className="w-full bg-[#116aef] hover:bg-[#0f5ed8]"
						>
							Request Appointment
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
