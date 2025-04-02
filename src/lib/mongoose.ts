import mongoose from "mongoose";

// Define a type for our cached mongoose connection
interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

// Declare global variable with proper typing
declare global {
	var mongooseCache: MongooseCache | undefined;
}

// Global is used here to maintain a cached connection across hot reloads
// in development and to prevent connections growing exponentially
// in production due to serverless function invocations
const cached: MongooseCache = global.mongooseCache || {
	conn: null,
	promise: null,
};

if (!global.mongooseCache) {
	global.mongooseCache = cached;
}

// Increase max listeners to prevent warnings
mongoose.connection.setMaxListeners(20);

export async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	// Check for both possible environment variable names
	const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

	// Debug logging to help identify the issue
	console.log("Environment variables check:");
	console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
	console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
	console.log("Final URI exists:", !!uri);

	// List all environment variables that contain "MONGO" for debugging
	const mongoEnvVars = Object.keys(process.env).filter(
		(key) => key.includes("MONGO") || key.includes("mongo")
	);
	console.log("All MongoDB-related env vars:", mongoEnvVars);

	if (!uri) {
		throw new Error(
			"MongoDB connection string is undefined. Please define either MONGO_URI or MONGODB_URI environment variable in your Vercel project settings."
		);
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		console.log(
			"Attempting to connect to MongoDB with URI:",
			uri.substring(0, 20) + "..." // Only show beginning of URI for security
		);

		cached.promise = mongoose
			.connect(uri, opts)
			.then((mongooseInstance) => {
				console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("MongoDB Connection Error:", err.message);
				console.error("Error code:", err.code);
				console.error("Error stack:", err.stack);
				throw err;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

// Import all models to ensure they're registered
import "../models/userModel";
import "../models/appointmentModel";
import "../models/appointmentRequestModel";
import "../models/conversationModel";
import "../models/messageModel";
import "../models/prescriptionModel";
import "../models/doctorModel";

// Export models to use throughout the application
export const User =
	mongoose.models.User || mongoose.model("User", new mongoose.Schema({}));
export const Appointment =
	mongoose.models.Appointment ||
	mongoose.model("Appointment", new mongoose.Schema({}));
export const Conversation =
	mongoose.models.Conversation ||
	mongoose.model("Conversation", new mongoose.Schema({}));
export const Message =
	mongoose.models.Message || mongoose.model("Message", new mongoose.Schema({}));
export const Prescription =
	mongoose.models.Prescription ||
	mongoose.model("Prescription", new mongoose.Schema({}));
export const Doctor =
	mongoose.models.Doctor || mongoose.model("Doctor", new mongoose.Schema({}));
