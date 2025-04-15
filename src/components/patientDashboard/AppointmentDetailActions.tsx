"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Video, X, ArrowLeft } from "lucide-react";
import { isPast, addMinutes } from "date-fns";

interface AppointmentDetailActionsProps {
	appointmentId: string;
	appointmentDate: Date;
	appointmentType: "in-person" | "virtual";
	appointmentStatus: "scheduled" | "completed" | "cancelled";
	onCancel: () => void;
}

export default function AppointmentDetailActions({
	appointmentId,
	appointmentDate,
	appointmentType,
	appointmentStatus,
	onCancel,
}: AppointmentDetailActionsProps) {
	const router = useRouter();

	// Check if appointment is active (within 15 minutes before or 60 minutes after start time)
	const isAppointmentActive = () => {
		const now = new Date();
		const fifteenMinutesBefore = addMinutes(appointmentDate, -15);
		const sixtyMinutesAfter = addMinutes(appointmentDate, 60);

		return now >= fifteenMinutesBefore && now <= sixtyMinutesAfter;
	};

	const canJoinVideoCall =
		appointmentType === "virtual" &&
		appointmentStatus === "scheduled" &&
		isAppointmentActive();

	const isPastAppointment =
		isPast(appointmentDate) || appointmentStatus === "cancelled";

	return (
		<div className="flex flex-wrap gap-3 justify-between">
			<Button
				variant="outline"
				onClick={() => router.push("/patient/dashboard/upcoming-appointments")}
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back to Appointments
			</Button>

			<div className="flex flex-wrap gap-3">
				{canJoinVideoCall && (
					<Button
						className="bg-indigo-600 hover:bg-indigo-700"
						onClick={() =>
							router.push(
								`/patient/dashboard/upcoming-appointments/${appointmentId}/video-consultation`
							)
						}
					>
						<Video className="mr-2 h-4 w-4" />
						Join Video Call
					</Button>
				)}

				{!isPastAppointment && appointmentStatus === "scheduled" && (
					<Button variant="destructive" onClick={onCancel}>
						<X className="mr-2 h-4 w-4" />
						Cancel Appointment
					</Button>
				)}
			</div>
		</div>
	);
}
