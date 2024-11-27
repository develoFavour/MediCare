import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { email, password } = reqBody;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: "User does not exist" },
				{ status: 400 }
			);
		}

		// Check if email is verified
		if (!user.isVerified) {
			return NextResponse.json(
				{ error: "Please verify your email before logging in" },
				{ status: 400 }
			);
		}

		// Check if password is correct
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return NextResponse.json({ error: "Invalid password" }, { status: 400 });
		}

		// Create tokens
		const tokenData = {
			id: user._id,
			email: user.email,
			role: user.role,
		};
		const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
			expiresIn: "15m",
		});
		const refreshToken = jwt.sign(
			tokenData,
			process.env.REFRESH_TOKEN_SECRET!,
			{
				expiresIn: "7d",
			}
		);

		const response = NextResponse.json({
			message: "Login successful",
			success: true,
			user: {
				id: user._id,
				email: user.email,
				role: user.role,
			},
		});

		// Set cookies
		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60,
		});
		response.cookies.set("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return response;
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
