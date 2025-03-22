import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(req: NextRequest) {
	try {
		const { token, userId } = await req.json();

		console.log("Received verification request:", { token, userId });

		if (!token || !userId) {
			console.log("Missing token or userId");
			return NextResponse.json(
				{ error: "Token and userId are required" },
				{ status: 400 }
			);
		}

		// First check if the user is already verified
		const alreadyVerifiedUser = await User.findOne({
			_id: userId,
			isVerified: true,
		});

		if (alreadyVerifiedUser) {
			console.log("User is already verified:", alreadyVerifiedUser.email);
			return NextResponse.json({
				message: "Email already verified",
				success: true,
				alreadyVerified: true,
			});
		}

		const user = await User.findOne({
			_id: userId,
			verifyTokenExpiration: { $gt: Date.now() },
		});

		if (!user) {
			console.log(
				"No user found with the provided userId and valid token expiration"
			);
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
