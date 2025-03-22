import mongoose from "mongoose";

const appointmentRequestSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	symptoms: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "approved", "rejected", "completed"],
		default: "pending",
	},
	assignedDoctor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const AppointmentRequest =
	mongoose.models.AppointmentRequest ||
	mongoose.model("AppointmentRequest", appointmentRequestSchema);

export default AppointmentRequest;
