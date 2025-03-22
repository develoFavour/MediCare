"use client";

import React, { useEffect, useState } from "react";
import { clientNavItems as navItems } from "@/app/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TypeIcon as type, LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";
import { ProfileSection } from "../patientDashboard/SideBarProfile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface NavigationItem {
	href: string;
	icon: LucideIcon;
	label: string;
}

interface PatientDashboardSideNavProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const PatientDashboardSideNav: React.FC<PatientDashboardSideNavProps> = ({
	open,
	setOpen,
}) => {
	const { userData, refreshUserData } = useUser();
	const [profileImageKey, setProfileImageKey] = useState(Date.now());

	useEffect(() => {
		// Force refresh the profile image when userData changes
		if (userData?.profileImage) {
			setProfileImageKey(Date.now());
		}
	}, [userData?.profileImage]);

	console.log("Patient User Data", userData);

	const pathname = usePathname();

	const getUserInitials = () => {
		if (!userData?.fullName) return "";
		const names = userData.fullName.split(" ");
		if (names.length >= 2) {
			return `${names[0][0]}${names[1][0]}`.toUpperCase();
		}
		return userData.fullName.substring(0, 2).toUpperCase();
	};

	const sidebarContent = (
		<div className="flex flex-col h-full">
			<div className="space-y-4 flex-1">
				<div className="px-3 py-2 border-b border-b-[#f1f1f1]">
					<div className="flex items-center gap-2 mb-4">
						{userData?.profileImage ? (
							<div className="relative h-16 w-16 rounded-full overflow-hidden img-shadow">
								<Image
									key={profileImageKey}
									src={userData.profileImage || "/placeholder.svg"}
									alt="user-avatar"
									width={64}
									height={64}
									className="object-cover h-full w-full"
									onError={() => {
										console.error("Failed to load profile image");
										// If image fails to load, force a refresh of user data
										refreshUserData();
									}}
								/>
							</div>
						) : (
							<div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xl img-shadow">
								{getUserInitials()}
							</div>
						)}
						<div>
							<p className="font-semibold text-lg text-gray-800">
								{userData?.fullName}
							</p>
							<span className="text-sm text-gray-600">{userData?.role}</span>
						</div>
					</div>
				</div>
				<ul className="space-y-1 px-3">
					{navItems.map((item: NavigationItem) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;

						return (
							<li
								key={item.label}
								className={cn("", isActive ? "navlist-item" : "")}
							>
								<Link
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors navlist-hover",
										isActive
											? "text-[#116aef] bg-[#e9f2ff] hover:bg-[#e9f2ff]"
											: "hover:text-white nav-list-item"
									)}
									onClick={() => setOpen(false)}
								>
									<Icon
										className={cn(
											"h-8 w-8 p-[6px] rounded-[7px]",
											isActive ? "bg-[#116aef] text-white" : "hover:text-white"
										)}
									/>
									<span>{item.label}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="mt-auto px-3 py-4">
				<ProfileSection />
			</div>
		</div>
	);

	return (
		<>
			<nav className="dashboard-nav-bg fixed left-0 top-0 hidden lg:flex h-screen w-[310px] flex-col justify-between border-r border-gray-200 pt-8 text-white sm:p-4 xl:py-6 xl:px-0 overflow-y-auto">
				{sidebarContent}
			</nav>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="left" className="p-0 w-[310px] dashboard-nav-bg">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setOpen(false)}
						className="absolute right-4 top-4 text-white"
					>
						<X className="h-6 w-6" />
					</Button>
					{sidebarContent}
				</SheetContent>
			</Sheet>
		</>
	);
};

export default PatientDashboardSideNav;
