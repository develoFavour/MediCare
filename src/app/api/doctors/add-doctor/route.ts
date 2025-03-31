import { type NextRequest, NextResponse } from "next/server";
import Doctor from "@/models/doctorModel";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

connect();

// Ensure upload directory exists
async function ensureDirectoryExists(dirPath: string) {
	try {
		await mkdir(dirPath, { recursive: true });
	} catch (error) {
		console.error("Error creating directory:", error);
	}
}

export async function POST(req: NextRequest) {
	try {
		// Check if the request is multipart/form-data
		const contentType = req.headers.get("content-type") || "";

		let reqBody;
		let profileImageUrl = "";

		if (contentType.includes("multipart/form-data")) {
			// Handle form data
			const formData = await req.formData();
			reqBody = Object.fromEntries(formData);

			// Handle file upload if present
			const profileImage = formData.get("profileImage") as File;

			if (profileImage && profileImage.size > 0) {
				try {
					// Create directory for uploads if it doesn't exist
					const uploadDir = path.join(process.cwd(), "public/uploads/doctors");
					await ensureDirectoryExists(uploadDir);

					// Generate unique filename
					const timestamp = Date.now();
					const filename = `${timestamp}-${profileImage.name.replace(
						/\s+/g,
						"-"
					)}`;
					const filePath = path.join(uploadDir, filename);

					// Convert file to ArrayBuffer and save
					const arrayBuffer = await profileImage.arrayBuffer();
					const uint8Array = new Uint8Array(arrayBuffer);
					await writeFile(filePath, uint8Array);

					// Set the URL for the profile image (relative to public directory)
					profileImageUrl = `/uploads/doctors/${filename}`;
					console.log("Image saved at:", profileImageUrl);
				} catch (error) {
					console.error("Error saving image:", error);
					// Continue with the request even if image upload fails
				}
			}

			// Process form data into a new object
			reqBody = {
				...reqBody,
				age: reqBody.age ? Number(reqBody.age) : undefined,
			};
		} else {
			// Handle JSON data
			reqBody = await req.json();
		}

		const {
			fullName,
			email,
			password,
			gender,
			specialty,
			age,
			dateOfBirth,
			phoneNumber,
		} = reqBody;

		console.log("Received data:", {
			fullName,
			email,
			gender,
			specialty,
			age,
			dateOfBirth,
			phoneNumber,
		});

		if (
			!fullName ||
			!email ||
			!password ||
			!specialty ||
			!age ||
			!gender ||
			!dateOfBirth ||
			!phoneNumber
		) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 400 }
			);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			email,
			password: hashedPassword,
			role: "doctor",
			age: Number(age),
			gender,
			phoneNumber,
			profileImage: profileImageUrl || "",
			isVerified: true,
		});
		await newUser.save();

		console.log("User saved:", newUser);

		// Create new doctor
		const newDoctor = new Doctor({
			user: newUser._id,
			specialty,
			dateOfBirth,
		});
		await newDoctor.save();

		console.log("Doctor saved:", newDoctor);

		return NextResponse.json(
			{
				message: "Doctor added successfully",
				doctor: {
					...newDoctor.toObject(),
					user: {
						...newUser.toObject(),
						password: undefined, // Don't send password back
					},
				},
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("An error occurred:", error);
		return NextResponse.json(
			{
				error: error.message || "An internal server error occurred.",
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
