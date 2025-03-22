import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
	try {
		const doctors = await User.find({ role: "doctor" }).select(
			"fullName specialty"
		);
		return NextResponse.json(doctors);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
