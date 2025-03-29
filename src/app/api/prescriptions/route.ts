import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Prescription from "@/models/prescriptionModel";
import mongoose from "mongoose";
import { checkAuthRole } from "@/lib/authHelpers";

connect();

export async function POST(request: NextRequest) {
	try {
		// Verify user is authenticated and is a doctor
		const { isAuthorized, user, response } = await checkAuthRole(request, [
			"doctor",
		]);
		if (!isAuthorized) {
			return response as Response; // Type assertion to ensure it's a Response
		}

		const reqBody = await request.json();
		const {
			appointmentId,
			patientId,
			doctorId,
			diagnosis,
			symptoms,
			medications,
			additionalNotes,
			status,
		} = reqBody;

		// Validate required fields
		if (!appointmentId || !patientId || !doctorId) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Create new prescription
		const newPrescription = new Prescription({
			appointmentId,
			patientId,
			doctorId,
			diagnosis: diagnosis || "",
			symptoms: symptoms || "",
			medications: medications || [],
			additionalNotes: additionalNotes || "",
			status: status || "draft",
		});

		// Save prescription to database
		const savedPrescription = await newPrescription.save();

		// Populate patient and doctor information
		const populatedPrescription = await Prescription.findById(
			savedPrescription._id
		)
			.populate("patientId", "fullName email profileImage age gender")
			.populate("doctorId", "fullName email profileImage specialization");

		return NextResponse.json({
			success: true,
			message: "Prescription created successfully",
			prescription: populatedPrescription,
		});
	} catch (error: any) {
		console.error("Error creating prescription:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		// Verify user is authenticated
		const { isAuthorized, user, response } = await checkAuthRole(request);
		if (!isAuthorized) {
			return response as Response; // Type assertion to ensure it's a Response
		}

		const { searchParams } = new URL(request.url);
		const doctorId = searchParams.get("doctorId");
		const patientId = searchParams.get("patientId");
		const appointmentId = searchParams.get("appointmentId");

		const query: any = {};

		// Build query based on parameters
		if (doctorId) {
			query.doctorId = new mongoose.Types.ObjectId(doctorId);
		}

		if (patientId) {
			query.patientId = new mongoose.Types.ObjectId(patientId);
		}

		if (appointmentId) {
			query.appointmentId = appointmentId;

			// If looking for a specific appointment's prescription, return just one
			const prescription = await Prescription.findOne(query)
				.populate("patientId", "fullName email profileImage age gender")
				.populate("doctorId", "fullName email profileImage specialization");

			return NextResponse.json({
				success: true,
				prescription,
			});
		}

		// If user is not an admin or doctor, they can only see their own prescriptions
		if (user && user.role !== "admin" && user.role !== "doctor") {
			query.patientId = new mongoose.Types.ObjectId(user._id);
		}

		// Get all prescriptions matching the query
		const prescriptions = await Prescription.find(query)
			.populate("patientId", "fullName email profileImage")
			.populate("doctorId", "fullName email profileImage specialization")
			.sort({ updatedAt: -1 });

		return NextResponse.json({
			success: true,
			prescriptions,
		});
	} catch (error: any) {
		console.error("Error fetching prescriptions:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
