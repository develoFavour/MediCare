import jwt from "jsonwebtoken";
export const getTokenData = (token: string) => {
	try {
		const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
		return decodedToken;
	} catch (error: any) {
		console.error("Error verifying token:", error);
		return null;
	}
};
