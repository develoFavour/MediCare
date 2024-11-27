import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Please enter your name"],
			trim: true,
			maxlength: [50, "Name cannot be more than 50 characters"],
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: [8, "Password must be at least 8 characters long"],
		},
		role: {
			type: String,
			enum: ["patient", "doctor", "admin"],
			default: "patient",
		},
		age: {
			type: Number,
			required: [true, "Please enter your age"],
		},
		gender: {
			type: String,
			required: [true, "Please select your gender"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		forgotPasswordToken: String,
		forgotPasswordTokenExpiration: Date,
		verifyToken: String,
		verifyTokenExpiration: Date,
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', function(next) {
	console.log('About to save user:', this.toObject());
	next();
  });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

console.log("User model created successfully");
