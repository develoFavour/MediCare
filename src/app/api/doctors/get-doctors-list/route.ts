import Doctor from "@/models/doctorModel";
import { connect } from "@/dbConfig/dbConfig";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		console.log("Connecting to database...");
		await connect();
		console.log("Connected to database. Fetching doctors...");

		const doctors = await Doctor.find({})
			.populate("user", "fullName email role age gender profileImage")
			.lean();

		console.log(`Found ${doctors.length} doctors`);

		// Transform the data to include both user and doctor information
		const formattedDoctors = doctors
			.map((doctor) => {
				if (!doctor.user) {
					console.warn(`Doctor with ID ${doctor._id} has no associated user`);
					return null;
				}
				return {
					_id: doctor._id,
					fullName: doctor.user.fullName,
					email: doctor.user.email,
					specialty: doctor.specialty,
					age: doctor.user.age,
					gender: doctor.user.gender,
					image: doctor.user.profileImage,
				};
			})
			.filter(Boolean); // Remove null entries

		console.log(`Formatted ${formattedDoctors.length} valid doctor entries`);

		return NextResponse.json(formattedDoctors, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching doctors:", error);
		return NextResponse.json(
			{ message: "Error fetching doctors", error: error.toString() },
			{ status: 500 }
		);
	}
}
