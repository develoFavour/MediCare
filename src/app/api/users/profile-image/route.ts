import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { put } from "@vercel/blob";

// Connect to database
connect();

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const userId = formData.get("userId") as string;
		const image = formData.get("image") as File;

		console.log("Received profile image update request for user:", userId);

		if (!userId || !image) {
			console.error("Missing userId or image in request");
			return NextResponse.json(
				{ error: "User ID and image are required" },
				{ status: 400 }
			);
		}

		// Validate file type
		const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
		if (!validTypes.includes(image.type)) {
			console.error("Invalid file type:", image.type);
			return NextResponse.json(
				{
					error:
						"Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
				},
				{ status: 400 }
			);
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (image.size > maxSize) {
			console.error("File too large:", image.size);
			return NextResponse.json(
				{ error: "Image size should not exceed 5MB" },
				{ status: 400 }
			);
		}

		// Generate a unique filename with timestamp
		const timestamp = new Date().getTime();
		const fileExtension = image.name.split(".").pop();
		const fileName = `profile-${userId}-${timestamp}.${fileExtension}`;

		// Upload to Vercel Blob Storage
		const blob = await put(fileName, image, {
			access: "public",
			contentType: image.type,
		});

		console.log("Image uploaded to Vercel Blob:", blob.url);

		// Ensure userId is a valid ObjectId
		let objectId;
		try {
			objectId = new mongoose.Types.ObjectId(userId);
		} catch (error) {
			console.error("Invalid userId format:", error);
			return NextResponse.json(
				{ error: "Invalid user ID format" },
				{ status: 400 }
			);
		}

		// First check if the user exists
		const userExists = await User.findById(objectId);
		if (!userExists) {
			console.error("User not found with ID:", userId);
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		console.log("User found:", userExists._id);

		// Then update the user with $set operator
		const updatedUser = await User.findByIdAndUpdate(
			objectId,
			{ $set: { profileImage: blob.url } },
			{ new: true }
		);

		if (!updatedUser) {
			console.error("Failed to update user after finding user");
			return NextResponse.json(
				{ error: "Failed to update user" },
				{ status: 500 }
			);
		}

		console.log("User updated successfully:", updatedUser._id);
		console.log("New profile image URL:", updatedUser.profileImage);

		return NextResponse.json({
			message: "Profile image updated successfully",
			imageUrl: blob.url,
			success: true,
			user: {
				_id: updatedUser._id,
				profileImage: updatedUser.profileImage,
			},
		});
	} catch (error: any) {
		console.error("Error updating profile image:", error);
		console.error("Error stack:", error.stack);
		return NextResponse.json(
			{ error: error.message || "Failed to update profile image" },
			{ status: 500 }
		);
	}
}
