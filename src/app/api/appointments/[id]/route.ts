import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointmentModel";
import mongoose from "mongoose";
import { sendNotificationEmail } from "@/utils/emailService";

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

		const appointment = await Appointment.findById(id)
			.populate("userId", "fullName email")
			.populate("doctorId", "fullName email");

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 }
			);
		}

		const updatedAppointment = await Appointment.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		)
			.populate("userId", "fullName email profileImage")
			.populate("doctorId", "fullName email profileImage");

		// Send notification email to patient about status change
		if (status && status !== appointment.status) {
			try {
				const statusMessages = {
					completed: `Your appointment with Dr. ${
						appointment.doctorId.fullName
					} on ${new Date(
						appointment.date
					).toLocaleString()} has been marked as completed.`,
					cancelled: `Your appointment with Dr. ${
						appointment.doctorId.fullName
					} on ${new Date(
						appointment.date
					).toLocaleString()} has been cancelled.${
						notes ? ` Reason: ${notes}` : ""
					}`,
					"no-show": `Your appointment with Dr. ${
						appointment.doctorId.fullName
					} on ${new Date(
						appointment.date
					).toLocaleString()} has been marked as a no-show as you did not attend.`,
				};

				const statusSubjects = {
					completed: "Appointment Completed",
					cancelled: "Appointment Cancelled",
					"no-show": "Missed Appointment",
				};

				if (statusMessages[status as keyof typeof statusMessages]) {
					await sendNotificationEmail({
						email: appointment.userId.email,
						subject: statusSubjects[status as keyof typeof statusSubjects],
						message: statusMessages[status as keyof typeof statusMessages],
					});
					console.log(
						`Status change notification sent to patient: ${appointment.userId.email}`
					);
				}
			} catch (emailError) {
				console.error("Error sending status change notification:", emailError);
				// Don't fail the request if email sending fails
			}
		}

		// Send notification email if appointment date is rescheduled
		if (date && date !== appointment.date) {
			try {
				await sendNotificationEmail({
					email: appointment.userId.email,
					subject: "Appointment Rescheduled",
					message: `Your appointment with Dr. ${
						appointment.doctorId.fullName
					} has been rescheduled to ${new Date(date).toLocaleString()}.${
						notes ? ` Notes: ${notes}` : ""
					}`,
				});
				console.log(
					`Rescheduling notification sent to patient: ${appointment.userId.email}`
				);
			} catch (emailError) {
				console.error("Error sending rescheduling notification:", emailError);
				// Don't fail the request if email sending fails
			}
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

		const appointment = await Appointment.findById(id)
			.populate("userId", "email")
			.populate("doctorId", "fullName");

		if (!appointment) {
			return NextResponse.json(
				{ error: "Appointment not found" },
				{ status: 404 }
			);
		}

		// Send notification email about appointment deletion
		try {
			await sendNotificationEmail({
				email: appointment.userId.email,
				subject: "Appointment Cancelled",
				message: `Your appointment with Dr. ${
					appointment.doctorId.fullName
				} on ${new Date(
					appointment.date
				).toLocaleString()} has been cancelled.`,
			});
		} catch (emailError) {
			console.error(
				"Error sending appointment cancellation email:",
				emailError
			);
			// Continue with deletion even if email fails
		}

		const deletedAppointment = await Appointment.findByIdAndDelete(id);

		return NextResponse.json({
			success: true,
			message: "Appointment deleted successfully",
		});
	} catch (error: any) {
		console.error("Error deleting appointment:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
