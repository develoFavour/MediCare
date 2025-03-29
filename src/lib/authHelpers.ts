import { type NextRequest, NextResponse } from "next/server";
import type mongoose from "mongoose";
import User from "@/models/userModel";

// Define User interface with required properties
interface UserDocument {
	_id: mongoose.Types.ObjectId | string;
	fullName: string;
	email: string;
	role: "admin" | "doctor" | "patient";
	gender?: string;
	age?: number;
	profileImage?: string;
	[key: string]: any; // Allow for other properties
}

// Function to verify JWT token
export function verifyToken(token: string): { isValid: boolean; payload: any } {
	try {
		const [headerB64, payloadB64] = token.split(".");
		const payload = JSON.parse(atob(payloadB64));
		const now = Math.floor(Date.now() / 1000);

		return {
			isValid: !(payload.exp && payload.exp < now),
			payload,
		};
	} catch (error) {
		console.error("Token verification error:", error);
		return { isValid: false, payload: null };
	}
}

// Get authenticated user from token
export async function getAuthUser(
	req: NextRequest
): Promise<{ user: UserDocument | null; error: string | null }> {
	// Get token from cookies
	const token = req.cookies.get("token")?.value || "";

	if (!token) {
		return { user: null, error: "Unauthorized: No token provided" };
	}

	// Verify token
	const { isValid, payload } = verifyToken(token);

	if (!isValid || !payload) {
		return { user: null, error: "Unauthorized: Invalid token" };
	}

	try {
		// Get user from database using the user ID from token payload
		const user = await User.findById(payload.id).lean();

		if (!user) {
			return { user: null, error: "Unauthorized: User not found" };
		}

		return { user: user as unknown as UserDocument, error: null };
	} catch (error) {
		console.error("Error fetching user:", error);
		return { user: null, error: "Server error: Failed to fetch user" };
	}
}

// Middleware to check if user is authenticated and has required role
export async function checkAuthRole(
	req: NextRequest,
	allowedRoles: string[] = []
) {
	const { user, error } = await getAuthUser(req);

	if (error || !user) {
		return {
			isAuthorized: false,
			user: null,
			response: NextResponse.json(
				{ error: error || "Unauthorized" },
				{ status: 401 }
			),
		};
	}

	// If roles are specified, check if user has one of the allowed roles
	if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
		return {
			isAuthorized: false,
			user,
			response: NextResponse.json(
				{ error: "Forbidden: Insufficient permissions" },
				{ status: 403 }
			),
		};
	}

	return { isAuthorized: true, user, response: null };
}
