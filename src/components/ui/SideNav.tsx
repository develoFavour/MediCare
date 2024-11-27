"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ProfileSection } from "../patientDashboard/SideBarProfile";

interface NavigationItem {
	href: string;
	icon: LucideIcon;
	label: string;
}

interface SideNavProps {
	navItems: NavigationItem[];
	showProfileSection?: boolean;
	userData: {
		fullName?: string;
		role?: string;
	} | null;
}

const SideNav: React.FC<SideNavProps> = ({
	navItems,
	showProfileSection = true,
	userData,
}) => {
	const pathname = usePathname();

	return (
		<nav className="dashboard-nav-bg fixed left-0 top-0 flex h-screen w-[310px] flex-col justify-between border-r border-gray-200 pt-8 text-white max-md:hidden sm:p-4 xl:py-6 xl:px-0 overflow-y-auto">
			<div className="space-y-4">
				<div className="px-3 border-b border-b-[#f1f1f1]">
					<div className="flex gap-2 items-center mb-4">
						<Image
							src="/img/avatar.jpg"
							height={90}
							width={90}
							alt={`${userData?.fullName}'s avatar`}
							className="h-16 w-16 rounded-full object-cover img-shadow"
						/>
						<div>
							<p className="font-semibold text-lg text-gray-800">
								{userData?.fullName}
							</p>
							<span className="text-sm text-gray-600">{userData?.role}</span>
						</div>
					</div>
				</div>
				<ul className="space-y-1">
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

			{showProfileSection && <ProfileSection />}
		</nav>
	);
};

export default SideNav;
