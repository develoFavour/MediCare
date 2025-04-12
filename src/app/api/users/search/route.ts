import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

// Connect to database
connect();

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
	try {
		const userId = await getDataFromToken(request);

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const searchQuery = request.nextUrl.searchParams.get("q");

		if (!searchQuery) {
			return NextResponse.json(
				{ error: "Search query is required" },
				{ status: 400 }
			);
		}

		// Get the current user's role
		const currentUser = await User.findById(userId);

		if (!currentUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Define search criteria based on user role
		const searchCriteria: any = {
			_id: { $ne: userId }, // Exclude current user
		};

		// If admin, can search for doctors and patients
		if (currentUser.role === "admin") {
			searchCriteria.role = { $in: ["doctor", "patient"] };
		}
		// If doctor, can search for patients and admins
		else if (currentUser.role === "doctor") {
			searchCriteria.role = { $in: ["patient", "admin"] };
		}
		// If patient, can search for doctors and admins
		else if (currentUser.role === "patient") {
			searchCriteria.role = { $in: ["doctor", "admin"] };
		}

		// Add search term
		searchCriteria.$or = [
			{ fullName: { $regex: searchQuery, $options: "i" } },
			{ email: { $regex: searchQuery, $options: "i" } },
		];

		console.log("Search criteria:", JSON.stringify(searchCriteria, null, 2));

		// Search for users
		const users = await User.find(searchCriteria)
			.select("fullName email role profileImage")
			.limit(10)
			.lean();

		console.log(`Found ${users.length} users matching search criteria`);

		return NextResponse.json(users);
	} catch (error: any) {
		console.error("Error searching users:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to search users" },
			{ status: 500 }
		);
	}
}
