import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import AppointmentRequest from "@/models/appointmentRequestModel";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
	try {
		await connect(); // Ensure database connection

		// Get doctorId from query parameters
		const url = new URL(request.url);
		const doctorId = url.searchParams.get("doctorId");

		if (!doctorId) {
			return NextResponse.json(
				{ error: "Doctor ID is required" },
				{ status: 400 }
			);
		}

		// Convert string ID to ObjectId
		const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

		// Find appointment requests assigned to this doctor with status "approved"
		const appointmentRequests = await AppointmentRequest.find({
			assignedDoctor: doctorObjectId,
			status: "approved", // Only get approved requests that need scheduling
		})
			.populate({
				path: "userId",
				select: "fullName email profileImage",
			})
			.sort({ createdAt: -1 });

		console.log(
			`Found ${appointmentRequests.length} appointment requests for doctor ${doctorId}`
		);

		return NextResponse.json({
			success: true,
			appointmentRequests,
		});
	} catch (error: any) {
		console.error("Error fetching doctor's appointment requests:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to fetch appointment requests" },
			{ status: 500 }
		);
	}
}
