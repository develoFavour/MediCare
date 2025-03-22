import mongoose from "mongoose";

export interface IDoctor {
	_id: mongoose.Types.ObjectId | string;
	user: mongoose.Types.ObjectId | string;
	specialty: string;
	experience?: number;
	qualifications?: string[];
	bio?: string;
	availability?: {
		days: string[];
		hours: string[];
	};
}

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

// Add a pre-save hook to ensure the user exists before saving
doctorSchema.pre("save", async function (next) {
	const User = mongoose.model("User");
	const userExists = await User.findById(this.user);
	if (!userExists) {
		throw new Error("User does not exist");
	}
	next();
});

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
