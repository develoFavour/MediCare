import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import AppointmentRequest from "@/models/appointmentRequestModel";
import { sendNotificationEmail } from "@/utils/emailService";

connect();

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const { doctorId, status } = await request.json();

		const updatedRequest = await AppointmentRequest.findByIdAndUpdate(
			id,
			{
				assignedDoctor: doctorId,
				status: status || "approved",
			},
			{ new: true }
		)
			.populate("userId")
			.populate("assignedDoctor");

		if (!updatedRequest) {
			return NextResponse.json(
				{ error: "Appointment request not found" },
				{ status: 404 }
			);
		}

		// Send notification to the user
		await sendNotificationEmail({
			email: updatedRequest.userId.email,
			subject: "Appointment Request Update",
			message: `Your appointment request has been ${status}. ${
				status === "approved"
					? `You have been assigned to Dr. ${updatedRequest.assignedDoctor.fullName}. Wait for Date and Time confirmation`
					: ""
			}`,
		});

		// Send notification to the doctor
		if (status === "approved") {
			await sendNotificationEmail({
				email: updatedRequest.assignedDoctor.email,
				subject: "New Appointment Assigned",
				message: `You have been assigned a new appointment with patient ${updatedRequest.userId.fullName}. Please check your dashboard for more details.`,
			});
		}

		return NextResponse.json({
			message: "Appointment request updated successfully",
			success: true,
			appointmentRequest: updatedRequest,
		});
	} catch (error: any) {
		console.error("Error in updating appointment request:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
