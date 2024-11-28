import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getTokenData } from "@/helpers/getTokenData";

connect();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get("token")?.value;
		if (!token) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}
		const tokenData = getTokenData(token);
		if (!tokenData) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}
		const user = await User.findById(tokenData.id).select("-password");
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({
			message: "User found",
			data: user,
		});
	} catch (error: any) {
		console.error("Error in GET /api/user/profile:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
