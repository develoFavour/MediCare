"use client";

import "@/app/(root)/globals.css";
import PatientDashboardSideNav from "@/components/ui/PatientDashboard";
import { UserProvider } from "@/app/context/UserContext";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientsDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<html lang="en">
			<body className="flex min-h-screen bg-gray-100">
				<UserProvider>
					<PatientDashboardSideNav
						open={sidebarOpen}
						setOpen={setSidebarOpen}
					/>
					<div className="flex-1 flex flex-col min-h-screen px-3 lg:ml-[310px]">
						<header className="bg-white shadow-sm lg:hidden">
							<div className="px-4 py-2 flex items-center">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setSidebarOpen(true)}
									className="lg:hidden"
								>
									<Menu className="h-6 w-6" />
								</Button>
								<h1 className="text-xl font-semibold text-gray-800 ml-2">
									Dashboard
								</h1>
							</div>
						</header>
						<main className="flex-1 overflow-x-hidden overflow-y-auto">
							{children}
						</main>
					</div>
				</UserProvider>
			</body>
		</html>
	);
}
