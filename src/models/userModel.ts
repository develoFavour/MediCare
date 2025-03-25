import mongoose from "mongoose";

export interface IUser {
	_id: mongoose.Types.ObjectId | string;
	fullName: string;
	email: string;
	password: string;
	phoneNumber: string;
	role: "patient" | "doctor" | "admin";
	age: number;
	gender: string;
	isVerified: boolean;
	verifyToken?: string;
	verifyTokenExpiration?: Date;
	profileImage?: string;
	isApproved?: boolean;
	assignedDoctor?: mongoose.Types.ObjectId | string;
}
const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: [true, "Please provide a name"],
	},
	email: {
		type: String,
		required: [true, "Please provide an email"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
	},
	phoneNumber: {
		type: String,
		required: [true, "Please provide your phone number"],
	},
	role: {
		type: String,
		enum: ["patient", "doctor", "admin"],
		default: "patient",
	},
	age: {
		type: Number,
		required: [true, "Please provide an age"],
	},
	gender: {
		type: String,
		required: [true, "Please provide a gender"],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verifyToken: String,
	verifyTokenExpiration: Date,
	profileImage: {
		type: String,
		default: "",
	},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
