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

	// Check if MONGO_URI is defined
	if (!process.env.MONGO_URI) {
		throw new Error(
			"Please define the MONGO_URI environment variable inside .env.local or in your Vercel project settings"
		);
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose
			.connect(process.env.MONGO_URI, opts)
			.then((mongooseInstance) => {
				console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("MongoDB Connection Error:", err);
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
