import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	dosage: {
		type: String,
		required: true,
	},
	frequency: {
		type: String,
		required: true,
	},
	duration: {
		type: String,
		default: "",
	},
	instructions: {
		type: String,
		default: "",
	},
});

const prescriptionSchema = new mongoose.Schema(
	{
		appointmentId: {
			type: String,
			required: true,
		},
		patientId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		doctorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		diagnosis: {
			type: String,
			default: "",
		},
		symptoms: {
			type: String,
			default: "",
		},
		medications: {
			type: [medicationSchema],
			default: [],
		},
		additionalNotes: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["draft", "issued"],
			default: "draft",
		},
	},
	{ timestamps: true }
);

// Check if model already exists to prevent overwrite error during hot reloading
const Prescription =
	mongoose.models.Prescription ||
	mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
