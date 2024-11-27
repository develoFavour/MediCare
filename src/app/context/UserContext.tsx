"use client";

import React, {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/lib/getUserDetails";

interface UserData {
	fullName: string;
	email: string;
	role: "admin" | "doctor" | "patient";
	gender: string;
	age: Number;
	bloodType: string;
}

interface UserContextType {
	userData: UserData | null;
	isLoading: boolean;
	error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const loadUserData = async () => {
			try {
				const data = await fetchUserData();
				setUserData(data.data);

				if (data.data) {
					switch (data.data.role) {
						case "admin":
							router.push("/admin/dashboard");
							break;
						case "doctor":
							router.push("/doctor/dashboard");
							break;
						case "patient":
							router.push("/patient/dashboard");
							break;
						default:
							router.push("/login");
					}
				}
			} catch (err: any) {
				console.error("Error loading user data:", err);
				setError(err.message || "Failed to load user data");
			} finally {
				setIsLoading(false);
			}
		};

		loadUserData();
	}, [router]);

	const value: UserContextType = {
		userData,
		isLoading,
		error,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (typeof window !== "undefined" && context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context || { userData: null, isLoading: true, error: null };
};

export default UserContext;
