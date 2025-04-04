import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "icofont/dist/icofont.min.css";
import ClientLayout from "./clientLayout";
import { UserProvider } from "@/app/context/UserContext";
import { MessageProvider } from "../context/MessageContext";

const poppins = Poppins({
	subsets: ["latin-ext"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-poppins",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "MediCare - Your Health, Our Priority",
		template: "%s | MediCare",
	},
	description:
		"MediCare offers top-quality healthcare services with a focus on patient care and innovative treatments.",
	keywords: ["healthcare", "medical services", "doctors", "appointments"],
	authors: [{ name: "MediCare Team" }],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://medicare.com",
		siteName: "MediCare",
		title: "MediCare - Your Health, Our Priority",
		description:
			"Top-quality healthcare services with a focus on patient care.",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={poppins.variable}>
			<body className="font-sans antialiased">
				<UserProvider>
					{/* <MessageProvider> */}
					<ClientLayout>{children}</ClientLayout>
					{/* </MessageProvider> */}
				</UserProvider>
			</body>
		</html>
	);
}
