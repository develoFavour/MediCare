import type { NextRequest } from "next/server";
import { getTokenData } from "./getTokenData";

export const getDataFromToken = async (request: NextRequest) => {
	try {
		// Get the token from the cookies
		const token = request.cookies.get("token")?.value || "";

		if (!token) {
			return null;
		}

		// Use your existing getTokenData function to verify and decode the token
		const decodedToken = getTokenData(token);

		if (!decodedToken) {
			return null;
		}

		// Return the user ID from the decoded token
		return decodedToken.id || decodedToken._id || decodedToken.userId;
	} catch (error) {
		console.error("Error extracting data from token:", error);
		return null;
	}
};
