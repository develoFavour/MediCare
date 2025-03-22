import { connect } from "@/dbConfig/dbConfig";
import User, { type IUser } from "@/models/userModel";
import Doctor, { type IDoctor } from "@/models/doctorModel";
import Appointment from "@/models/appointmentModel";
import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

connect();

export async function GET(
	req: NextRequest,
	{ params }: { params: { patientId: string } }
) {
	try {
		console.log("Fetching patient with ID:", params.patientId);

		const patient = await User.findById(params.patientId).lean<IUser>();

		if (!patient) {
			console.log("Patient not found in the database");
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Fetch assigned doctor information if exists
		let assignedDoctorInfo = null;
		if (patient.assignedDoctor) {
			const doctorUser = await User.findById(
				patient.assignedDoctor
			).lean<IUser>();
			const doctorDetails = await Doctor.findOne({
				user: patient.assignedDoctor,
			}).lean<IDoctor>();
			if (doctorUser && doctorDetails) {
				assignedDoctorInfo = {
					_id: doctorUser._id,
					fullName: doctorUser.fullName,
					specialty: doctorDetails.specialty,
				};
			}
		}

		// Fetch appointments with doctor information
		const appointments = await Appointment.find({ userId: patient._id }).lean();

		// Get doctor information for each appointment
		const appointmentsWithDoctorInfo = await Promise.all(
			appointments.map(async (appointment) => {
				const doctorUser = await User.findById(
					appointment.doctorId
				).lean<IUser>();
				const doctorDetails = await Doctor.findOne({
					user: appointment.doctorId,
				}).lean<IDoctor>();
				return {
					...appointment,
					doctorId:
						doctorUser && doctorDetails
							? {
									_id: doctorUser._id,
									fullName: doctorUser.fullName,
									specialty: doctorDetails.specialty,
							  }
							: null,
				};
			})
		);

		const patientWithDetails = {
			...patient,
			assignedDoctor: assignedDoctorInfo,
			appointments: appointmentsWithDoctorInfo,
		};

		return NextResponse.json(patientWithDetails, { status: 200 });
	} catch (error) {
		console.error("Error fetching patient details:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { patientId: string } }
) {
	try {
		const { approved, doctorId } = await req.json();
		const updateData: Partial<IUser> = {};

		if (approved !== undefined) {
			updateData.isApproved = approved;
		}

		if (doctorId !== undefined) {
			updateData.assignedDoctor = new mongoose.Types.ObjectId(doctorId);
		}

		const updatedPatient = await User.findByIdAndUpdate(
			params.patientId,
			{ $set: updateData },
			{ new: true }
		).lean<IUser>();

		if (!updatedPatient) {
			return NextResponse.json({ error: "Patient not found" }, { status: 404 });
		}

		// Fetch updated patient details with doctor information
		const doctorUser = updatedPatient.assignedDoctor
			? await User.findById(updatedPatient.assignedDoctor).lean<IUser>()
			: null;
		const doctorDetails = doctorUser
			? await Doctor.findOne({
					user: updatedPatient.assignedDoctor,
			  }).lean<IDoctor>()
			: null;

		const patientWithDetails = {
			...updatedPatient,
			assignedDoctor:
				doctorUser && doctorDetails
					? {
							_id: doctorUser._id,
							fullName: doctorUser.fullName,
							specialty: doctorDetails.specialty,
					  }
					: null,
		};

		return NextResponse.json(patientWithDetails, { status: 200 });
	} catch (error) {
		console.error("Error updating patient:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
