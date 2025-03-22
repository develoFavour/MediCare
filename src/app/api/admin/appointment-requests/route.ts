import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import AppointmentRequest from "@/models/appointmentRequestModel";

connect();

export async function GET(request: NextRequest) {
	try {
		const appointmentRequests = await AppointmentRequest.find()
			.populate("userId", "fullName")
			.populate("assignedDoctor", "fullName")
			.sort({ createdAt: -1 });
		return NextResponse.json(appointmentRequests);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
