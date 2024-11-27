import mongoose from "mongoose";
export const connect = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI!);
		const connection = mongoose.connection;
		connection.on("connected", () => {
			console.log("Connected to MongoDB");
		});
		connection.on("error", (error) => {
			console.log("Error connecting to MongoDB", error);
			process.exit();
		});
	} catch (error) {
		console.log("Error connecting to MongoDB", error);
	}
};
