import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { sendNotificationEmail } from "@/utils/emailService";

connect();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { email, subject, message } = reqBody;

		if (!email || !subject || !message) {
			return NextResponse.json(
				{ error: "Email, subject, and message are required" },
				{ status: 400 }
			);
		}

		// Send notification email
		await sendNotificationEmail({
			email,
			subject,
			message,
		});

		return NextResponse.json({
			success: true,
			message: "Notification email sent successfully",
		});
	} catch (error: any) {
		console.error("Error sending notification email:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to send notification email" },
			{ status: 500 }
		);
	}
}
