"use client";

import type React from "react";
import {
	createContext,
	useState,
	useEffect,
	useContext,
	type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/lib/getUserDetails";

interface UserData {
	_id: string;
	fullName: string;
	email: string;
	role: "admin" | "doctor" | "patient";
	gender: string;
	age: number;
	bloodType: string;
	profileImage?: string;
	isApproved?: boolean;
	assignedDoctor?: any;
}

interface UserContextType {
	userData: UserData | null;
	isLoading: boolean;
	error: string | null;
	updateUserData: (newData: UserData) => void;
	refreshUserData: () => Promise<void>;
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

	const loadUserData = async () => {
		try {
			setIsLoading(true);
			const data = await fetchUserData();
			setUserData(data.data);
			return data.data;
		} catch (err: any) {
			console.error("Error loading user data:", err);
			setError(err.message || "Failed to load user data");
			return null;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const initializeUser = async () => {
			const user = await loadUserData();

			if (user) {
				// Only redirect on initial load, not on refreshes
				if (window.location.pathname === "/") {
					switch (user.role) {
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
			}
		};

		initializeUser();
	}, [router]);

	const updateUserData = (newData: UserData) => {
		setUserData(newData);
	};

	const refreshUserData = async () => {
		await loadUserData();
	};

	const value: UserContextType = {
		userData,
		isLoading,
		error,
		updateUserData,
		refreshUserData,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (typeof window !== "undefined" && context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return (
		context || {
			userData: null,
			isLoading: true,
			error: null,
			updateUserData: () => {},
			refreshUserData: async () => {},
		}
	);
};

export default UserContext;
