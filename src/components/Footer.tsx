import { Heart } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t mt-8 border-[#1565C0]">
			<div className="container mx-auto px-4 py-6 text-[#1565C0]">
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<p className="text-sm text-muted-foreground">
						© 2025 MediCare. All rights reserved.
					</p>
					<p className="flex items-center gap-1 text-sm text-muted-foreground">
						Made with <Heart className="h-4 w-4 text-red-500" /> by the MediCare
						team
					</p>
					<nav className="flex gap-4">
						<a
							href="#"
							className="text-sm text-muted-foreground hover:underline"
						>
							Privacy Policy
						</a>
						<a
							href="#"
							className="text-sm text-muted-foreground hover:underline"
						>
							Terms of Service
						</a>
						<a
							href="#"
							className="text-sm text-muted-foreground hover:underline"
						>
							Contact Us
						</a>
					</nav>
				</div>
			</div>
		</footer>
	);
}
