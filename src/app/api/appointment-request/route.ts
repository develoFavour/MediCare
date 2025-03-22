import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import AppointmentRequest from "@/models/appointmentRequestModel";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
	console.log("POST request received at /api/appointment-requests");
	try {
		await connect(); // Ensure database connection

		const reqBody = await request.json();
		console.log("Received appointment request:", reqBody);

		const { userId, symptoms } = reqBody;

		// Validate input
		if (!userId || !symptoms) {
			console.error("Missing required fields:", { userId, symptoms });
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Convert string ID to ObjectId
		const userObjectId = new mongoose.Types.ObjectId(userId);

		// Create new appointment request
		const newAppointmentRequest = new AppointmentRequest({
			userId: userObjectId,
			symptoms,
			status: "pending",
		});

		console.log("Creating new appointment request:", newAppointmentRequest);

		// Save appointment request to database
		const savedAppointmentRequest = await newAppointmentRequest.save();
		console.log(
			"Appointment request saved successfully:",
			savedAppointmentRequest
		);

		return NextResponse.json({
			message: "Appointment request submitted successfully",
			success: true,
			appointmentRequest: savedAppointmentRequest,
		});
	} catch (error: any) {
		console.error("Error in appointment request submission:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
