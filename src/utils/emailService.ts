import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: process.env.MAIL_TRAP_ID,
		pass: process.env.MAIL_TRAP_PASS,
	},
});

interface EmailParams {
	email: string;
	emailType: "VERIFY" | "RESET";
	userId: string;
	token: string;
}

export const sendEmail = async ({ email, emailType, userId }: EmailParams) => {
	try {
		// Generate a crypto token instead of using userId
		const token = crypto.randomBytes(32).toString("hex");
		const hashedToken = await bcrypt.hash(token, 10);

		if (emailType === "VERIFY") {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiration: Date.now() + 3600000, // 1 hour in milliseconds
			});
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiration: Date.now() + 3600000, // 1 hour in milliseconds
			});
		}

		const link = `${process.env.DOMAIN}/${
			emailType === "VERIFY" ? "verify-email" : "reset-password"
		}?token=${token}`;

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to: email,
			subject:
				emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
			html: `
        <h1>${
					emailType === "VERIFY"
						? "Welcome to MediCare!"
						: "Password Reset Request"
				}</h1>
        <p>Please click the link below to ${
					emailType === "VERIFY" ? "verify your email" : "reset your password"
				}:</p>
        <a href="${link}">${
				emailType === "VERIFY" ? "Verify Email" : "Reset Password"
			}</a>
        <p>This link will expire in 1 hour.</p>
      `,
		};

		await transporter.sendMail(mailOptions);
	} catch (error: any) {
		console.error("Error sending email:", error);
		throw new Error("Failed to send email");
	}
};
