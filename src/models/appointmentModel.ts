import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	doctorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	reason: {
		type: String,
		required: true,
	},
	notes: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		enum: ["in-person", "virtual", "phone"],
		default: "in-person",
	},
	status: {
		type: String,
		enum: ["scheduled", "completed", "cancelled", "no-show"],
		default: "scheduled",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Appointment =
	mongoose.models.Appointment ||
	mongoose.model("Appointment", appointmentSchema);

export default Appointment;
