import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointmentModel";
import mongoose from "mongoose";

// Get a specific appointment
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connect();
		const id = params.id;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid appointment ID" },
				{ status: 400 }
			);
		}

		const appointment = await Appointment.findById(id)
			.populate("userId", "fullName email profileImage")
			.populate("doctorId", "fullName email profileImage");

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			appointment,
		});
	} catch (error: any) {
		console.error("Error fetching appointment:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// Update an appointment
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connect();
		const id = params.id;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid appointment ID" },
				{ status: 400 }
			);
		}

		const reqBody = await request.json();
		const { status, notes, date, type } = reqBody;

		// Validate the status
		if (
			status &&
			!["scheduled", "completed", "cancelled", "no-show"].includes(status)
		) {
			return NextResponse.json(
				{ error: "Invalid status value" },
				{ status: 400 }
			);
		}

		// Build update object
		const updateData: any = {};
		if (status) updateData.status = status;
		if (notes) updateData.notes = notes;
		if (date) updateData.date = new Date(date);
		if (type) updateData.type = type;

		const updatedAppointment = await Appointment.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		)
			.populate("userId", "fullName email profileImage")
			.populate("doctorId", "fullName email profileImage");

		if (!updatedAppointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Appointment updated successfully",
			appointment: updatedAppointment,
		});
	} catch (error: any) {
		console.error("Error updating appointment:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// Delete an appointment
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await connect();
		const id = params.id;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return NextResponse.json(
				{ error: "Invalid appointment ID" },
				{ status: 400 }
			);
		}

		const deletedAppointment = await Appointment.findByIdAndDelete(id);

		if (!deletedAppointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Appointment deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting appointment:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
