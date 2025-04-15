"use client";

import { useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import VideoConsultation from "@/components/telemedicine/VideoConsultation";

export default function DoctorVideoConsultationPage() {
	const params = useParams();
	const { userData } = useUser();
	const appointmentId = params.id as string;

	return (
		<VideoConsultation
			appointmentId={appointmentId}
			doctorId={userData?._id}
			isDoctor={true}
		/>
	);
}
