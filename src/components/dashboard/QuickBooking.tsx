"use client";

import { useState } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function QuickBooking() {
	const router = useRouter();
	const [department, setDepartment] = useState("");
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [timeSlot, setTimeSlot] = useState("");

	const handleProceed = () => {
		if (department && date && timeSlot) {
			// In a real implementation, you would pass these values to the booking page
			router.push(
				`/patient/appointments/book?department=${department}&date=${date.toISOString()}&time=${timeSlot}`
			);
		}
	};

	// Mock time slots
	const timeSlots = [
		"09:00 AM",
		"09:30 AM",
		"10:00 AM",
		"10:30 AM",
		"11:00 AM",
		"11:30 AM",
		"02:00 PM",
		"02:30 PM",
		"03:00 PM",
		"03:30 PM",
		"04:00 PM",
		"04:30 PM",
	];

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg font-semibold">
					Quick Appointment Booking
				</CardTitle>
				<CardDescription>
					Select department, date and time to quickly book an appointment
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							Department
						</label>
						<Select value={department} onValueChange={setDepartment}>
							<SelectTrigger>
								<SelectValue placeholder="Select department" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cardiology">Cardiology</SelectItem>
								<SelectItem value="dermatology">Dermatology</SelectItem>
								<SelectItem value="neurology">Neurology</SelectItem>
								<SelectItem value="orthopedics">Orthopedics</SelectItem>
								<SelectItem value="pediatrics">Pediatrics</SelectItem>
								<SelectItem value="gynecology">Gynecology</SelectItem>
								<SelectItem value="ophthalmology">Ophthalmology</SelectItem>
								<SelectItem value="dentistry">Dentistry</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Date</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!date && "text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{date ? format(date, "PPP") : "Select date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									initialFocus
									disabled={(date) =>
										date < new Date() ||
										date >
											new Date(new Date().setMonth(new Date().getMonth() + 3))
									}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							Time Slot
						</label>
						<Select
							value={timeSlot}
							onValueChange={setTimeSlot}
							disabled={!date}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select time">
									{timeSlot ? (
										<div className="flex items-center">
											<Clock className="mr-2 h-4 w-4" />
											{timeSlot}
										</div>
									) : (
										"Select time"
									)}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{timeSlots.map((slot) => (
									<SelectItem key={slot} value={slot}>
										<div className="flex items-center">
											<Clock className="mr-2 h-4 w-4" />
											{slot}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button
					onClick={handleProceed}
					disabled={!department || !date || !timeSlot}
					className="flex items-center"
				>
					Proceed to Booking <ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
}
