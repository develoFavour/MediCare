import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointmentModel";
import AppointmentRequest from "@/models/appointmentRequestModel";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
	try {
		await connect(); // Ensure database connection

		const reqBody = await request.json();
		console.log("Received appointment creation request:", reqBody);

		const { appointmentRequestId, date, notes, type } = reqBody;

		// Validate input
		if (!appointmentRequestId || !date) {
			console.error("Missing required fields:", { appointmentRequestId, date });
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Find the approved appointment request
		const appointmentRequest = await AppointmentRequest.findById(
			appointmentRequestId
		).populate("userId assignedDoctor");

		if (!appointmentRequest) {
			return NextResponse.json(
				{ error: "Appointment request not found" },
				{ status: 404 }
			);
		}

		if (appointmentRequest.status !== "approved") {
			return NextResponse.json(
				{
					error:
						"Cannot schedule an appointment for a request that is not approved",
				},
				{ status: 400 }
			);
		}

		// Create new appointment
		const newAppointment = new Appointment({
			userId: appointmentRequest.userId._id,
			doctorId: appointmentRequest.assignedDoctor._id,
			date: new Date(date),
			reason: appointmentRequest.symptoms,
			notes: notes || "",
			type: type || "in-person",
			status: "scheduled",
		});

		console.log("Creating new appointment:", newAppointment);

		// Save appointment to database
		const savedAppointment = await newAppointment.save();
		console.log("Appointment saved successfully:", savedAppointment);

		try {
			// Update the appointment request status to "completed"
			appointmentRequest.status = "completed";
			await appointmentRequest.save();
			console.log("Appointment request status updated to completed");
		} catch (statusError) {
			console.error("Error updating appointment request status:", statusError);
			// Continue with the flow even if status update fails
			// We'll handle this gracefully and still return the appointment
		}

		return NextResponse.json({
			message: "Appointment scheduled successfully",
			success: true,
			appointment: savedAppointment,
		});
	} catch (error: any) {
		console.error("Error in appointment scheduling:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		await connect();

		const url = new URL(request.url);
		const doctorId = url.searchParams.get("doctorId");
		const userId = url.searchParams.get("userId");

		let query = {};

		if (doctorId) {
			query = { ...query, doctorId: new mongoose.Types.ObjectId(doctorId) };
		}

		if (userId) {
			query = { ...query, userId: new mongoose.Types.ObjectId(userId) };
		}

		const appointments = await Appointment.find(query)
			.populate("userId", "fullName email profileImage")
			.populate("doctorId", "fullName email profileImage")
			.sort({ date: 1 });

		return NextResponse.json({
			success: true,
			appointments,
		});
	} catch (error: any) {
		console.error("Error fetching appointments:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
