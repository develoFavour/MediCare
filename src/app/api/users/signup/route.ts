import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/utils/emailService";

connect();

// Password validation function
const isPasswordValid = (password: string) => {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(?=.{8,})/;
	const isValid = passwordRegex.test(password);
	return {
		isValid,
		message: !isValid
			? "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*())."
			: "",
	};
};

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		const { fullName, email, password, phoneNumber, age, gender } = reqBody;
		console.log(reqBody);

		// Validate required fields
		if (!fullName || !email || !password || !age || !gender) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Please enter a valid email address" },
				{ status: 400 }
			);
		}

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
			age: Number(age),
			gender,
			verifyToken: hashedToken,
			verifyTokenExpiration: Date.now() + 3600000,
		});

		let savedUser;
		try {
			savedUser = await newUser.save();
			console.log("User saved successfully:", savedUser._id);
		} catch (saveError: any) {
			if (saveError.name === "ValidationError") {
				for (const field in saveError.errors) {
					console.log(`${field}: ${saveError.errors[field].message}`);
				}
			}
			throw saveError;
		}

		// Send verification email
		try {
			console.log("Sending verification email to:", email);

			// Validate email parameters before sending
			if (!email || !savedUser._id || !verificationToken) {
				console.error("Missing required parameters for verification email:", {
					email: !!email,
					userId: !!savedUser._id,
					token: !!verificationToken,
				});
				throw new Error("Missing required parameters for verification email");
			}

			const emailResult = await sendEmail({
				email: savedUser.email,
				emailType: "VERIFY",
				userId: savedUser._id.toString(),
				token: verificationToken,
			});

			if (emailResult.success) {
				console.log(
					"Verification email sent successfully:",
					emailResult.messageId
				);
			} else {
				console.error("Failed to send verification email:");
				// Delete the user if email sending fails
				await User.findByIdAndDelete(savedUser._id);
				return NextResponse.json(
					{
						error: "An Error Occurred. Please try creating an account again.",
					},
					{ status: 500 }
				);
			}
		} catch (emailError: any) {
			console.error("Failed to send verification email:", emailError);
			// Delete the user if email sending fails
			await User.findByIdAndDelete(savedUser._id);
			return NextResponse.json(
				{
					error: "An Error Occurred. Please try creating an account again.",
				},
				{ status: 500 }
			);
		}

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
