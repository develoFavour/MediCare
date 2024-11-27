import { UserProvider } from "@/app/context/UserContext";

import "@/app/(root)/globals.css";

import AdminSideNav from "@/components/ui/adminSideNav";

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
					<AdminSideNav />
					<div className="flex-1 ml-[310px]">{children}</div>
				</UserProvider>
			</body>
		</html>
	);
}
