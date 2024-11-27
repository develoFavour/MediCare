"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LucideIcon,
	ChevronDown,
	ChevronUp,
	Home,
	MessageCircle,
	User,
	Users,
	PlusCircle,
	BedDouble,
	ClipboardList,
	DoorOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

interface NavigationItem {
	href: string;
	icon: LucideIcon;
	label: string;
	subItems?: NavigationItem[];
}

// Define adminNavItems here if it's not imported
const adminNavItems: NavigationItem[] = [
	{ href: "/admin/dashboard", icon: Home, label: "Home" },
	{ href: "/admin/messages", icon: MessageCircle, label: "Messages" },
	{
		href: "/admin/doctors",
		icon: User,
		label: "Doctors",
		subItems: [
			{
				href: "/admin/doctors/list",
				icon: ClipboardList,
				label: "Doctors List",
			},
			{ href: "/admin/doctors/add", icon: PlusCircle, label: "Add Doctor" },
		],
	},
	{
		href: "/admin/patients",
		icon: Users,
		label: "Patients",
		subItems: [
			{
				href: "/admin/patients/list",
				icon: ClipboardList,
				label: "Patients List",
			},
		],
	},
	{
		href: "/admin/rooms",
		icon: BedDouble,
		label: "Rooms",
		subItems: [
			{
				href: "/admin/rooms/alloted",
				icon: ClipboardList,
				label: "Rooms Alloted",
			},
			{
				href: "/admin/rooms/available",
				icon: DoorOpen,
				label: "Available Rooms",
			},
		],
	},
];

const AdminSideNav = () => {
	const { userData } = useUser();
	const pathname = usePathname();
	const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

	const toggleDropdown = (label: string) => {
		setOpenDropdowns((prev) =>
			prev.includes(label)
				? prev.filter((item) => item !== label)
				: [...prev, label]
		);
	};

	const renderNavItem = (item: NavigationItem, isSubItem = false) => {
		const Icon = item.icon;
		const isActive = pathname === item.href;
		const hasSubItems = item.subItems && item.subItems.length > 0;
		const isOpen = openDropdowns.includes(item.label);

		return (
			<li key={item.label} className={cn("", isActive ? "navlist-item" : "")}>
				<Link
					href={hasSubItems ? "#" : item.href}
					className={cn(
						"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors navlist-hover",
						isActive
							? "text-[#116aef] bg-[#e9f2ff] hover:bg-[#e9f2ff]"
							: "hover:text-white nav-list-item",
						isSubItem && "pl-10"
					)}
					onClick={() => hasSubItems && toggleDropdown(item.label)}
				>
					<Icon
						className={cn(
							"h-8 w-8 p-[6px] rounded-[7px]",
							isActive ? "bg-[#116aef] text-white" : "hover:text-white"
						)}
					/>
					<span>{item.label}</span>
					{hasSubItems && (
						<span className="ml-auto">
							{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
						</span>
					)}
				</Link>
				{hasSubItems && isOpen && (
					<ul className="mt-2 space-y-1">
						{item.subItems!.map((subItem) => renderNavItem(subItem, true))}
					</ul>
				)}
			</li>
		);
	};

	return (
		<nav className="dashboard-nav-bg fixed left-0 top-0 flex h-screen w-[310px] flex-col justify-between border-r border-gray-200 pt-8 text-white max-md:hidden sm:p-4 xl:py-6 xl:px-0 overflow-y-auto">
			<div className="space-y-4">
				<div className="px-3 border-b border-b-[#f1f1f1]">
					<div className="flex gap-2 items-center mb-4">
						<Image
							src="/img/avatar.jpg"
							height={90}
							width={90}
							alt="user-avatar"
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
					{adminNavItems.map((item) => renderNavItem(item))}
				</ul>
			</div>

			{/* Remove or replace ProfileSection if it's not available */}
			{/* <ProfileSection /> */}
		</nav>
	);
};

export default AdminSideNav;
