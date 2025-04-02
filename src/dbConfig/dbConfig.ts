import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";

// Fix for MaxListenersExceededWarning
mongoose.connection.setMaxListeners(20);

// Legacy connect function for backward compatibility
const connectLegacy = async () => {
	try {
		if (mongoose.connection.readyState === 1) {
			return mongoose.connection.asPromise();
		}

		const conn = await mongoose.connect(process.env.MONGODB_URI as string);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
		return conn;
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

// Export the new connection function but maintain backward compatibility
export const connect = connectToDatabase;
