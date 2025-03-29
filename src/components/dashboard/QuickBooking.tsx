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
import { Input } from "../ui/input";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import toast from "react-hot-toast";

export function QuickBooking() {
	const { userData } = useUser();
	const router = useRouter();
	const [reason, setReason] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	console.log(reason);

	const handleSubmit = async () => {
		try {
			setLoading(true);
			const response = await axios.post("/api/appointment-request", {
				userId: userData?._id,
				symptoms: reason,
			});
			if (response.status === 200) {
				toast.success("Appointment request submitted successfully.");
				router.push("/patient/dashboard/appointment");
				setReason("");
				setLoading(false);
			} else {
				toast.error("Failed to submit appointment");
				setLoading(false);
			}
			console.log(response);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card className="bg-white shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg font-semibold">
					Quick Appointment Booking
				</CardTitle>
				<CardDescription>
					Book an immediate appointment with a doctor.{" "}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div>
					<Input
						type="text"
						placeholder="Your Appointment reason"
						onChange={(e) => setReason(e.target.value)}
					/>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button
					onClick={handleSubmit}
					disabled={!reason}
					className="flex items-center"
				>
					Proceed to Booking <ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
}
