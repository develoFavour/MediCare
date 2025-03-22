import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Doctor from "@/models/doctorModel";
import mongoose from "mongoose";

export async function GET(
	request: NextRequest,
	{ params }: { params: { doctorId: string } }
) {
	try {
		console.log("Connecting to database...");
		await connect();
		console.log(
			"Connected to database. Fetching doctor with ID:",
			params.doctorId
		);

		// Validate doctorId format
		if (!mongoose.Types.ObjectId.isValid(params.doctorId)) {
			console.error("Invalid doctor ID format:", params.doctorId);
			return NextResponse.json(
				{ error: "Invalid doctor ID format" },
				{ status: 400 }
			);
		}

		const doctor = (await Doctor.findById(params.doctorId)
			.populate("user", "fullName email role age gender profileImage")
			.lean()) as any;

		if (!doctor) {
			console.error("Doctor not found with ID:", params.doctorId);
			return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
		}

		console.log("Doctor found:", doctor._id);

		// Transform the data to include both user and doctor information
		if (!doctor.user) {
			console.error("Doctor has no associated user:", doctor._id);
			return NextResponse.json(
				{ error: "Doctor data is incomplete" },
				{ status: 500 }
			);
		}

		const formattedDoctor = {
			_id: doctor._id,
			fullName: doctor.user.fullName,
			email: doctor.user.email,
			specialty: doctor.specialty,
			age: doctor.user.age,
			gender: doctor.user.gender,
			image: doctor.user.profileImage,
			dateOfBirth: doctor.dateOfBirth,
		};

		return NextResponse.json(formattedDoctor, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching doctor:", error);
		return NextResponse.json(
			{ message: "Error fetching doctor", error: error.toString() },
			{ status: 500 }
		);
	}
}
