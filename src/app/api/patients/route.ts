import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Appointment from "@/models/appointmentModel";
import { type NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
	try {
		console.log("Fetching patients...");
		const patients = await User.find({ role: "patient" }).lean();
		console.log("Patients fetched:", patients.length);

		const patientsWithAppointments = await Promise.all(
			patients.map(async (patient) => {
				console.log(`Fetching appointments for patient ${patient._id}`);
				const appointments = await Appointment.find({ userId: patient._id })
					.populate("doctorId", "fullName specialty")
					.lean();

				// Fetch assigned doctor information if exists
				let assignedDoctor = null;
				if (patient.assignedDoctor) {
					const doctorUser = await User.findById(patient.assignedDoctor).lean();
					if (doctorUser) {
						assignedDoctor = {
							_id: (doctorUser as any)._id,
							fullName: (doctorUser as any).fullName,
							specialty: (doctorUser as any).specialty,
						};
					}
				}

				console.log(
					`Appointments fetched for patient ${patient._id}:`,
					appointments.length
				);
				return {
					...patient,
					assignedDoctor,
					appointments,
				};
			})
		);

		console.log(
			"Total patients with appointments:",
			patientsWithAppointments.length
		);
		return NextResponse.json(patientsWithAppointments, { status: 200 });
	} catch (error) {
		console.error("Error Fetching patients:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
