import type React from "react";
import { UserProvider } from "@/app/context/UserContext";
import "@/app/(root)/globals.css";
import PatientDashboardSideNav from "@/components/ui/PatientDashboard";
import { Toaster } from "react-hot-toast";
import { MessageProvider } from "@/app/context/MessageContext";

export const metadata = {
	title: "MediCare - Patient Dashboard",
	description: "Manage your healthcare with MediCare",
};

export default function PatientDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="flex min-h-screen bg-gray-100">
				<UserProvider>
					<MessageProvider>
						<PatientDashboardSideNav />
						<div className="flex-1 md:ml-[310px] p-4 md:p-6">{children}</div>
						<Toaster position="top-right" />
					</MessageProvider>
				</UserProvider>
			</body>
		</html>
	);
}
