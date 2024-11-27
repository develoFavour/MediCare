import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/utils/emailService";
import crypto from "crypto";

connect();

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();

		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		await user.save();

		await sendPasswordResetEmail(email, resetToken);

		return NextResponse.json({ message: "Password reset email sent" });
	} catch (error: any) {
		console.error("Forgot password error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
