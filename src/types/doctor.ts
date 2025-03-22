import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		specialty: {
			type: String,
			required: [true, "Please enter the doctor's specialty"],
			enum: [
				"Cardiology",
				"Dermatology",
				"Pediatrics",
				"Neurology",
				"General Practitioner",
				"Orthopedics",
				"Psychiatry",
				"Oncology",
				"Gynecology",
				"Urology",
			],
		},
		dateOfBirth: {
			type: Date,
			required: [true, "Please enter the doctor's date of birth"],
		},
	},
	{
		timestamps: true,
	}
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
