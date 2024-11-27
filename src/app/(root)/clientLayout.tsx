import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navigation />
			{children}
			<Footer />
		</>
	);
}
