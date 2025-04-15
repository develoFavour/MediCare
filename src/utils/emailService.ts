import nodemailer from "nodemailer";

interface EmailParams {
	email: string;
	subject: string;
	htmlContent: string;
}

interface VerificationEmailParams {
	email: string;
	userId: string;
	token: string;
}

interface NotificationEmailParams {
	email: string;
	subject: string;
	message: string;
}

interface AppointmentConfirmationParams {
	patientEmail: string;
	patientName: string;
	doctorName: string;
	appointmentDate: Date;
	appointmentType: string;
	notes?: string;
}

// Create a transporter using Gmail SMTP
const createTransporter = () => {
	// Check if required environment variables are set
	if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
		console.error(
			"Gmail credentials are not properly configured in environment variables"
		);
		throw new Error(
			"Email service configuration error: Gmail credentials missing"
		);
	}

	return nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.GMAIL_USER, // your Gmail address
			pass: process.env.GMAIL_APP_PASSWORD, // your Gmail app password
		},
	});
};

export const sendEmail = async ({
	email,
	subject,
	htmlContent,
}: EmailParams) => {
	try {
		console.log(`Attempting to send email to: ${email} via Gmail SMTP`);

		// Make sure we have all required fields
		if (!email || !subject || !htmlContent) {
			throw new Error(
				"Email, subject, and htmlContent are all required parameters"
			);
		}

		const transporter = createTransporter();

		// Send mail with defined transport object
		const info = await transporter.sendMail({
			from: `"MediCare" <${process.env.GMAIL_USER}>`, // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			html: htmlContent, // html body
		});

		console.log("Email sent successfully via Gmail SMTP:", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error: any) {
		console.error("Error in sendEmail function:", error);
		throw new Error(`Failed to send email: ${error.message}`);
	}
};

export const sendVerificationEmail = async ({
	email,
	userId,
	token,
}: VerificationEmailParams) => {
	const link = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&userId=${userId}`;
	const subject = "Verify Your Email for MediCare";

	// Create a more visually appealing HTML template
	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #116aef;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
          margin: -20px -20px 20px;
        }
        .button {
          display: inline-block;
          background-color: #116aef;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to MediCare!</h1>
        </div>
        <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
        <p>Click the button below to verify your email:</p>
        <p style="text-align: center;">
          <a href="${link}" class="button">Verify Email</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${link}</p>
        <p>This link will expire in 24 hours.</p>
        <div class="footer">
          <p>If you didn't create an account with MediCare, please ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} MediCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

	return sendEmail({ email, subject, htmlContent });
};

export const sendPasswordResetEmail = async ({
	email,
	userId,
	token,
}: VerificationEmailParams) => {
	const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&userId=${userId}`;
	const subject = "Reset Your Password for MediCare";

	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #116aef;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
          margin: -20px -20px 20px;
        }
        .button {
          display: inline-block;
          background-color: #116aef;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <p>We received a request to reset your password for your MediCare account.</p>
        <p>Click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${link}" class="button">Reset Password</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all;">${link}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MediCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

	return sendEmail({ email, subject, htmlContent });
};

export const sendNotificationEmail = async ({
	email,
	subject,
	message,
}: NotificationEmailParams) => {
	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #116aef;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
          margin: -20px -20px 20px;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subject}</h1>
        </div>
        <div>${message}</div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MediCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

	return sendEmail({ email, subject, htmlContent });
};

export const sendAppointmentConfirmationEmail = async ({
	patientEmail,
	patientName,
	doctorName,
	appointmentDate,
	appointmentType,
	notes,
}: AppointmentConfirmationParams) => {
	const subject = "Your Appointment Has Been Scheduled";

	// Format the date nicely
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(appointmentDate);

	const appointmentTypeText =
		appointmentType === "virtual" ? "Virtual (Telehealth)" : "In-Person";

	const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          padding: 20px;
        }
        .header {
          background-color: #116aef;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 5px 5px 0 0;
          margin: -20px -20px 20px;
        }
        .appointment-details {
          background-color: #f9f9f9;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
        }
        .detail-label {
          font-weight: bold;
          width: 120px;
        }
        .button {
          display: inline-block;
          background-color: #116aef;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
        .calendar-icon {
          text-align: center;
          margin: 20px 0;
        }
        .calendar-icon svg {
          width: 60px;
          height: 60px;
          fill: #116aef;
        }
        .notes {
          background-color: #fff8e1;
          border-left: 4px solid #ffc107;
          padding: 10px 15px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Confirmation</h1>
        </div>
        
        <p>Dear ${patientName},</p>
        
        <p>Your appointment with Dr. ${doctorName} has been successfully scheduled. Please find the details below:</p>
        
        <div class="calendar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
          </svg>
        </div>
        
        <div class="appointment-details">
          <div class="detail-row">
            <div class="detail-label">Date & Time:</div>
            <div>${formattedDate}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Doctor:</div>
            <div>Dr. ${doctorName}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Type:</div>
            <div>${appointmentTypeText}</div>
          </div>
          ${
						notes
							? `
          <div class="notes">
            <strong>Additional Notes:</strong>
            <p>${notes}</p>
          </div>
          `
							: ""
					}
        </div>
        
        <p><strong>What to bring:</strong></p>
        <ul>
          <li>Photo ID</li>
          <li>Insurance card (if applicable)</li>
          <li>List of current medications</li>
          <li>Any relevant medical records or test results</li>
        </ul>
        
        <p><strong>Appointment Reminders:</strong></p>
        <ul>
          <li>Please arrive 15 minutes before your scheduled appointment time.</li>
          <li>If you need to reschedule or cancel, please do so at least 24 hours in advance.</li>
          <li>For virtual appointments, you will receive a link to join the video call 30 minutes before your appointment.</li>
        </ul>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View in Dashboard</a>
        </p>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Thank you for choosing MediCare for your healthcare needs.</p>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} MediCare. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

	return sendEmail({ email: patientEmail, subject, htmlContent });
};
