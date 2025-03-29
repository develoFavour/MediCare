import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Prescription from "@/models/prescriptionModel";
import Appointment from "@/models/appointmentModel";
import { checkAuthRole } from "@/lib/authHelpers";

connect();

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Verify user is authenticated
		const { isAuthorized, user, response } = await checkAuthRole(request);
		if (!isAuthorized) {
			return response as Response; // Type assertion to ensure it's a Response
		}

		// Find the prescription
		const prescription = await Prescription.findById(id)
			.populate("patientId", "fullName email profileImage age gender")
			.populate("doctorId", "fullName email profileImage specialization");

		if (!prescription) {
			return NextResponse.json(
				{ error: "Prescription not found" },
				{ status: 404 }
			);
		}

		// Verify the user has access to this prescription
		if (
			!user ||
			(user.role !== "admin" &&
				user._id.toString() !== prescription.patientId._id.toString() &&
				user._id.toString() !== prescription.doctorId._id.toString())
		) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// Get appointment details if available
		try {
			const appointment = await Appointment.findById(
				prescription.appointmentId
			);
			if (appointment) {
				prescription.appointment = {
					date: appointment.date,
					type: appointment.type,
				};
			}
		} catch (err) {
			// If appointment not found, continue without it
			console.log("Appointment not found for prescription:", err);
		}

		return NextResponse.json({
			success: true,
			prescription,
		});
	} catch (error: any) {
		console.error("Error fetching prescription:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;
		const reqBody = await request.json();

		// Verify user is authenticated and is a doctor
		const { isAuthorized, user, response } = await checkAuthRole(request, [
			"doctor",
		]);
		if (!isAuthorized || !user) {
			return response as Response; // Type assertion to ensure it's a Response
		}

		// Find the prescription
		const prescription = await Prescription.findById(id);

		if (!prescription) {
			return NextResponse.json(
				{ error: "Prescription not found" },
				{ status: 404 }
			);
		}

		// Verify the doctor has access to update this prescription
		if (user._id.toString() !== prescription.doctorId.toString()) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// Update the prescription
		const updatedPrescription = await Prescription.findByIdAndUpdate(
			id,
			{ $set: reqBody },
			{ new: true }
		)
			.populate("patientId", "fullName email profileImage age gender")
			.populate("doctorId", "fullName email profileImage specialization");

		return NextResponse.json({
			success: true,
			prescription: updatedPrescription,
		});
	} catch (error: any) {
		console.error("Error updating prescription:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Verify user is authenticated and is a doctor or admin
		const { isAuthorized, user, response } = await checkAuthRole(request, [
			"doctor",
			"admin",
		]);
		if (!isAuthorized || !user) {
			return response as Response; // Type assertion to ensure it's a Response
		}

		// Find the prescription
		const prescription = await Prescription.findById(id);

		if (!prescription) {
			return NextResponse.json(
				{ error: "Prescription not found" },
				{ status: 404 }
			);
		}

		// Verify the user has access to delete this prescription
		if (
			user.role !== "admin" &&
			user._id.toString() !== prescription.doctorId.toString()
		) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// Delete the prescription
		await Prescription.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: "Prescription deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting prescription:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
