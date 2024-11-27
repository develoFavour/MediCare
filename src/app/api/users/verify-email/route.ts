import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(req: NextRequest) {
	try {
		const { token } = await req.json();

		if (!token) {
			console.log("No token provided");
			return NextResponse.json({ error: "Token is required" }, { status: 400 });
		}

		const user = await User.findOne({
			verifyTokenExpiration: { $gt: Date.now() },
		});

		if (!user) {
			console.log("No user found with a valid token");
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 400 }
			);
		}

		console.log("User found:", user.email);

		const isValidToken = await bcrypt.compare(token, user.verifyToken);

		if (!isValidToken) {
			console.log("Token comparison failed");
			return NextResponse.json({ error: "Invalid token" }, { status: 400 });
		}

		user.isVerified = true;
		user.verifyToken = undefined;
		user.verifyTokenExpiration = undefined;
		await user.save();

		console.log("User verified successfully");

		return NextResponse.json({
			message: "Email verified successfully",
			success: true,
		});
	} catch (error: any) {
		console.error("Email verification error:", error);
		return NextResponse.json(
			{ error: "An error occurred during email verification" },
			{ status: 500 }
		);
	}
}
