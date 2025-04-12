import type React from "react";
import { UserProvider } from "@/app/context/UserContext";
import "@/app/(root)/globals.css";
import AdminSideNav from "@/components/ui/adminSideNav";
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
						<AdminSideNav />
						<div className="flex-1 md:ml-[310px]">{children}</div>
					</MessageProvider>
				</UserProvider>
			</body>
		</html>
	);
}
