import type React from "react";
import { UserProvider } from "@/app/context/UserContext";
import "@/app/(root)/globals.css";
import DoctorsSideNav from "@/components/ui/doctorsSideNav";
import { MessageProvider } from "@/app/context/MessageContext";

export const metadata = {
	title: "MediCare",
	description: "Welcome to MediCare",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="flex min-h-screen">
				<UserProvider>
					<MessageProvider>
						<DoctorsSideNav />
						<div className="flex-1 md:ml-[310px] p-4 md:p-6 bg-gray-50">
							{children}
						</div>
					</MessageProvider>
				</UserProvider>
			</body>
		</html>
	);
}
