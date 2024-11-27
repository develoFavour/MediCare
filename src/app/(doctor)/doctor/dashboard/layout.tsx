import { UserProvider } from "@/app/context/UserContext";
import "@/app/(root)/globals.css";

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
			<body>
				<UserProvider>{children}</UserProvider>
			</body>
		</html>
	);
}
