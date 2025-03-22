import { UserProvider } from "@/app/context/UserContext";
import "@/app/(root)/globals.css";
import DoctorsSideNav from "@/components/ui/doctorsSideNav";

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
				<UserProvider>
					<DoctorsSideNav />
					{children}
				</UserProvider>
			</body>
		</html>
	);
}
