import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/emailService";
import crypto from "crypto";

connect();

// Password validation function
const isPasswordValid = (password: string) => {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumbers = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

	return {
		isValid:
			password.length >= minLength &&
			hasUpperCase &&
			hasLowerCase &&
			hasNumbers &&
			hasSpecialChar,
		message:
			password.length < minLength
				? "Password must be at least 8 characters long"
				: !hasUpperCase
				? "Password must contain at least one uppercase letter"
				: !hasLowerCase
				? "Password must contain at least one lowercase letter"
				: !hasNumbers
				? "Password must contain at least one number"
				: !hasSpecialChar
				? "Password must contain at least one special character"
				: "",
	};
};

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		const { fullName, email, password, phoneNumber, age, gender } = reqBody;
		console.log(reqBody);

		// Validate password
		const passwordCheck = isPasswordValid(password);
		if (!passwordCheck.isValid) {
			return NextResponse.json(
				{ error: passwordCheck.message },
				{ status: 400 }
			);
		}

		// Check if user exists
		const user = await User.findOne({ email });
		if (user) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			);
		}

		// Hash password with consistent salt rounds
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create verification token
		const verificationToken = crypto.randomBytes(32).toString("hex");
		const hashedToken = await bcrypt.hash(verificationToken, 10);

		// Create new user
		const newUser = new User({
			fullName,
			email,
			password: hashedPassword,
			phoneNumber,
			age: Number(age), // Explicitly convert to Number
			gender,
			verifyToken: hashedToken,
			verifyTokenExpiration: Date.now() + 3600000,
		});
		console.log("User created", newUser.toObject()); // Use toObject() for logging

		let savedUser;
		try {
			savedUser = await newUser.save();
			console.log("Saved user:", savedUser.toObject()); // Log the saved user
		} catch (saveError: any) {
			console.error("Error saving user:", saveError);
			if (saveError.name === "ValidationError") {
				for (let field in saveError.errors) {
					console.log(`${field}: ${saveError.errors[field].message}`);
				}
			}
			throw saveError;
		}

		// Send verification email
		await sendEmail({
			email: savedUser.email,
			emailType: "VERIFY",
			userId: savedUser._id.toString(),
			token: verificationToken,
		});

		return NextResponse.json({
			message:
				"User created successfully. Please check your email to verify your account.",
			success: true,
		});
	} catch (error: any) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
