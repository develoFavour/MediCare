import { type NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Prescription from "@/models/prescriptionModel";
import { checkAuthRole } from "@/lib/authHelpers";
import { sendEmail } from "@/utils/emailService";
import { format } from "date-fns";

connect();

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Verify user is authenticated and is a doctor
		const { isAuthorized, user, response } = await checkAuthRole(request, [
			"doctor",
		]);
		if (!isAuthorized) {
			return response as Response; // Type assertion to ensure it's a Response
		}

		// Find the prescription
		const prescription = await Prescription.findById(id)
			.populate("patientId", "fullName email")
			.populate("doctorId", "fullName email specialization");

		if (!prescription) {
			return NextResponse.json(
				{ error: "Prescription not found" },
				{ status: 404 }
			);
		}

		// Verify the doctor has access to send this prescription
		if (!user || user._id.toString() !== prescription.doctorId._id.toString()) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// Ensure prescription is issued
		if (prescription.status !== "issued") {
			// Update status to issued
			prescription.status = "issued";
			await prescription.save();
		}

		// Format medications for email
		const medicationsList = prescription.medications
			.map((med: any) => {
				const frequency = getFrequencyText(med.frequency);
				return `
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
          <p style="font-weight: bold; margin-bottom: 5px;">${med.name} ${
					med.dosage
				}</p>
          <p style="margin: 2px 0;">Frequency: ${frequency}</p>
          ${
						med.duration
							? `<p style="margin: 2px 0;">Duration: ${med.duration}</p>`
							: ""
					}
          ${
						med.instructions
							? `<p style="margin: 2px 0;">Instructions: ${med.instructions}</p>`
							: ""
					}
        </div>
      `;
			})
			.join("");

		// Send email to patient
		await sendEmail({
			email: prescription.patientId.email,
			subject: "Your Prescription from Dr. " + prescription.doctorId.fullName,
			htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Prescription</title>
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
            .section {
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              color: #116aef;
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
              <h1>Your Prescription</h1>
            </div>
            
            <p>Dear ${prescription.patientId.fullName},</p>
            
            <p>Please find your prescription details below, as prescribed by Dr. ${
							prescription.doctorId.fullName
						} on ${format(
				new Date(prescription.updatedAt),
				"MMMM d, yyyy"
			)}.</p>
            
            <div class="section">
              <div class="section-title">Diagnosis</div>
              <p>${prescription.diagnosis}</p>
            </div>
            
            <div class="section">
              <div class="section-title">Medications</div>
              ${medicationsList}
            </div>
            
            ${
							prescription.additionalNotes
								? `
            <div class="section">
              <div class="section-title">Additional Notes</div>
              <p>${prescription.additionalNotes}</p>
            </div>
            `
								: ""
						}
            
            <p>Please follow the medication instructions carefully. If you have any questions or experience any adverse effects, please contact your doctor immediately.</p>
            
            <p>You can view your prescription and other medical records by logging into your MediCare account.</p>
            
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} MediCare. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
		});

		return NextResponse.json({
			success: true,
			message: "Prescription sent successfully",
		});
	} catch (error: any) {
		console.error("Error sending prescription:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// Helper function to convert frequency codes to readable text
function getFrequencyText(frequency: string) {
	switch (frequency) {
		case "once-daily":
			return "Once daily";
		case "twice-daily":
			return "Twice daily";
		case "three-times-daily":
			return "Three times daily";
		case "four-times-daily":
			return "Four times daily";
		case "every-4-hours":
			return "Every 4 hours";
		case "every-6-hours":
			return "Every 6 hours";
		case "every-8-hours":
			return "Every 8 hours";
		case "every-12-hours":
			return "Every 12 hours";
		case "as-needed":
			return "As needed (PRN)";
		default:
			return frequency;
	}
}
