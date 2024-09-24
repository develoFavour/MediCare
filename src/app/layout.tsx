import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import "icofont/dist/icofont.min.css";
import Footer from "@/components/Footer/Footer";

const poppins = Poppins({ subsets: ["latin-ext"], weight: "400" });

export const metadata: Metadata = {
	title: "MediCare",
	description: "Welcome to Medi-Care",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={poppins.className}>
				<Navigation />
				{children}
				<Footer />
			</body>
		</html>
	);
}
